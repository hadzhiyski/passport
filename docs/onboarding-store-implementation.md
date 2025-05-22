# Pet Passport Onboarding Store Implementation Guide

## Overview

This guide provides detailed information on the domain-driven store architecture
used in the Pet Passport onboarding flow. It serves as a reference for
developers who need to understand, maintain, or extend the stores.

## Store Organization

The onboarding flow uses a domain-driven approach with the following store
organization:

```
/onboarding
  /stores
    index.ts             # Exports all stores
    onboarding-store.ts  # Coordinator store
    profile-store.ts     # Profile domain store
    pet-store.ts         # Pet domain store
    passport-store.ts    # Passport domain store
    README.md            # Store documentation
```

## Store Implementation Pattern

Each domain-specific store follows the same implementation pattern:

1. Define state interface (`xxxState`)
2. Define actions interface (`xxxActions`)
3. Define initial state
4. Create and export the store using Zustand
5. Implement persistence with localStorage
6. Implement actions that modify state

### Example Implementation Template

```typescript
// State type definition
type ExampleState = {
  data: DataType | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
};

// Actions type definition
type ExampleActions = {
  fetchData: (id?: string) => Promise<void>;
  storeData: (data: DataType) => void;
  submitData: () => Promise<boolean>;
  reset: () => void;
};

// Initial state
const initialState: ExampleState = {
  data: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

// Store creation with Zustand
export const useExampleStore = create<ExampleState & ExampleActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions implementation
      fetchData: async (id) => {...},
      storeData: (data) => {...},
      submitData: async () => {...},
      reset: () => set(initialState),
    }),
    {
      name: 'example-data',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## Domain-Specific Stores

### Profile Store

**State:**

- `personal`: Personal information (firstname, lastname, phone)
- `address`: Address information (address, city, country, postcode)
- Loading and error states

**Key Actions:**

- `fetchProfile`: Loads existing profile data
- `storePersonalData`: Updates personal information
- `storeAddressData`: Updates address information
- `submitProfile`: Saves complete profile to the server
- `reset`: Resets the store to initial state

### Pet Store

**State:**

- `petId`: ID of the current pet
- `basic`: Basic pet information (name, dob, sex)
- `characteristics`: Pet characteristics (species, breed, colors, notes)
- Loading and error states

**Key Actions:**

- `fetchPet`: Loads existing pet data by ID
- `storeBasicData`: Updates basic pet information
- `storeCharacteristicsData`: Updates pet characteristics
- `submitPet`: Saves complete pet data to the server
- `reset`: Resets the store to initial state

### Passport Store

**State:**

- `data`: Passport information (serialNumber, issueDate)
- Loading and error states

**Key Actions:**

- `fetchPassport`: Loads existing passport data by pet ID
- `storePassportData`: Updates passport information
- `submitPassport`: Saves passport data to the server
- `reset`: Resets the store to initial state

## Coordinator Store

The onboarding store acts as a coordinator between domain stores.

**State:**

- `completedSteps`: Tracking of step completion status

**Key Actions:**

- `markStepComplete`: Marks a specific step as completed
- `resetOnboarding`: Resets all stores
- `getPetName`: Convenience method to get pet name from pet store
- `initializeOnboardingData`: Loads all required data for the flow
- `isStepCompleted`: Checks if a step is completed

## Integration with Components

### Basic Usage Pattern

```tsx
function ExampleComponent() {
  // Access store state and actions
  const { data, isLoading, error, fetchData, storeData } = useExampleStore();

  // Initialize data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    storeData(formData);
    // Additional logic...
  };

  // Component rendering...
}
```

### Using the Coordinator

For components that need coordinated data:

```tsx
function CoordinatedComponent() {
  // Use the coordinator hook
  const { isLoading, error } = useOnboardingData();

  // Access specific stores as needed
  const { personal } = useProfileStore();
  const { basic: petBasic } = usePetStore();

  // Component logic...
}
```

## Best Practices

1. **Domain Isolation**: Keep domain logic within its respective store.
2. **State Updates**: Use `set` function for immutable state updates.
3. **API Integration**: Handle loading and error states consistently.
4. **Type Safety**: Maintain strong typing for all state and actions.
5. **Persistence**: Use consistent persistence keys for localStorage.
6. **Reset Logic**: Always provide a clean reset method for each store.
7. **Error Handling**: Provide clear error messages for users.

## Common Patterns

### Loading Data

```typescript
fetchData: async (id) => {
  try {
    set({ isLoading: true, error: null });
    const response = await apiCall(id);

    if (response.success) {
      set({
        data: response.data,
        isLoading: false,
      });
    } else {
      set({
        error: response.error || 'Failed to load data',
        isLoading: false,
      });
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    set({
      error: 'An unexpected error occurred',
      isLoading: false,
    });
  }
};
```

### Storing Form Data

```typescript
storeData: (data) => {
  set({ data });
};
```

### Submitting Data

```typescript
submitData: async () => {
  const { data } = get();

  if (!data) {
    set({ error: 'Data not found' });
    return false;
  }

  try {
    set({ isSubmitting: true, error: null });
    const result = await apiSubmit(data);

    if (!result.success) {
      set({
        error: result.error || 'Failed to save data',
        isSubmitting: false,
      });
      return false;
    }

    set({ isSubmitting: false });
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    set({
      error: 'An unexpected error occurred',
      isSubmitting: false,
    });
    return false;
  }
};
```
