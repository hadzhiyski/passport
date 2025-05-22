# Pet Passport Onboarding Technical Documentation

## Architecture Overview

The onboarding flow architecture follows a domain-driven design approach with a
clear separation of concerns. The implementation uses Next.js for the UI
framework and Zustand for state management.

## Key Components

### 1. Navigation System

The onboarding flow uses a dedicated navigation store to manage step
progression:

```typescript
// Navigation Store
export const useOnboardingNavigationStore = create<OnboardingNavigationState>()((set, get) => ({
  currentMainStep: 'welcome',
  currentMicroStep: null,

  // Navigation actions
  goToStep: (mainStep, microStep) => {...},
  goToPreviousStep: () => {...},
  goToNextStep: () => {...},
  goToNextMicroStep: () => {...},
  resetNavigation: (initialStep) => {...},
}));
```

The navigation store handles:

- Tracking current step and micro-step
- Moving forward and backward in the flow
- Initializing navigation state
- Managing micro-step sequencing

### 2. State Management

The onboarding flow uses a domain-driven state management approach with separate
stores for different domains:

#### Domain-Specific Stores

1. **Profile Store** (`profile-store.ts`)

   - Manages user profile data (personal and address information)
   - Handles API calls for fetching and updating profile data

2. **Pet Store** (`pet-store.ts`)

   - Manages pet information (basic details and characteristics)
   - Handles API calls for pet data operations

3. **Passport Store** (`passport-store.ts`)
   - Manages pet passport data
   - Handles passport-specific API operations

#### Coordinator Store

The **Onboarding Store** (`onboarding-store.ts`) coordinates between
domain-specific stores:

- Tracks completion status of steps
- Provides cross-store methods
- Handles synchronized data loading
- Manages reset operations across all stores

```typescript
// Onboarding Coordinator Store
export const useOnboardingDataStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      completedSteps: {
        profile: false,
        pet: false,
        passport: false,
      },

      // Actions
      markStepComplete: (step) => {...},
      resetOnboarding: () => {...},
      getPetName: () => {...},
      initializeOnboardingData: async (petId) => {...},
      isStepCompleted: (step) => {...},
    }),
    {
      name: 'onboarding-data',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 3. Data Integration Layer

Each store integrates with the application's API layer:

- **Profile Store** uses `tryGetOrAssumeOwnerProfile` and `upsertOwnerProfile`
- **Pet Store** uses `insertPet` and direct database queries
- **Passport Store** uses `insertPassport` and `fetchPassport`

### 4. Custom Hooks

The architecture includes custom hooks to simplify component integration:

```typescript
// useOnboardingData hook
export function useOnboardingData(petId?: string | null) {
  const { initializeOnboardingData } = useOnboardingDataStore();
  const { isLoading: isPetLoading, error: petError } = usePetStore();
  const { isLoading: isPassportLoading, error: passportError } =
    usePassportStore();

  // Consolidated states
  const isLoading = isPetLoading || isPassportLoading;
  const error = petError || passportError;

  // Initialize data
  useEffect(() => {
    initializeOnboardingData(petId);
  }, [petId, initializeOnboardingData]);

  return { isLoading, error };
}
```

### 5. Component Structure

The onboarding UI is built with a component hierarchy:

- **OnboardingFlow** - Main container component
  - **OnboardingStepsNav** - Progress indicator
  - **Step Components** (WelcomeStep, ProfileStep, PetStep, CompleteStep)
    - **MicroStep Components** (per step)
      - **Form Components** (with validation)

## Data Flow

1. User enters data in a form component
2. Data is stored in the appropriate domain store
3. On form submission, the store handles API integration
4. On successful submission, the coordinator store marks the step as complete
5. The navigation store advances to the next step

## State Persistence

All stores use Zustand's persistence middleware to save state in localStorage,
allowing users to resume the onboarding process if they close the browser.

## Error Handling

Error handling is managed at multiple levels:

1. **Form Validation** - Uses React Hook Form and Zod schemas
2. **API Error Handling** - Each store captures and formats API errors
3. **UI Error Display** - Components display appropriate error messages
4. **Navigation Guards** - Prevent progression if required data is missing

## Initialization Flow

When the onboarding flow initializes:

1. The navigation store sets the current step based on server data
2. The `useOnboardingData` hook triggers data initialization
3. Domain stores load any existing data from the API
4. UI components render based on the current step and loaded data

## Reset Flow

When resetting the onboarding process:

1. The coordinator store's `resetOnboarding` method is called
2. This method resets the coordinator's own state
3. Then it calls reset methods on each domain store
4. The navigation store is reset to the initial step
