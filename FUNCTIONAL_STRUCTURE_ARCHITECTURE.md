# Functional Structure - Clean Architecture

## Overview
The Functional Structure has been completely refactored into a clean, modular architecture with better separation of concerns and improved maintainability.

## Architecture

### 1. Main Component: `FunctionalStructure.jsx`
**Responsibilities:**
- Data fetching with React Query
- Global state management (level 0 dropdowns)
- Search coordination
- Navigation handling

**Key Features:**
- Clean, functional component with hooks
- Minimal state (only what's necessary)
- Clear separation of concerns
- Easy to test and maintain

### 2. Dropdown Component: `FunctionalDropdownItem.jsx`
**Responsibilities:**
- Individual dropdown item rendering
- Local state management for children
- Delete functionality
- Edit navigation
- Recursive rendering of subfunctions

**Key Features:**
- Self-contained component
- Manages its own children state
- Reusable for any level of nesting
- Clear props interface

### 3. Search Component: `FunctionalStructureSearch.jsx`
**Responsibilities:**
- Search input handling
- Suggestions generation
- Search result display
- Search interaction callbacks

**Key Features:**
- Isolated search logic
- Reusable component
- Clean callback pattern

## State Management Strategy

### Level 0 (Functions)
- **Global State:** `openLevel0ItemId` in main component
- **Behavior:** Only one function can be open at a time
- **Control:** Centralized in main component

### Level 1+ (Subfunctions)
- **Local State:** Each parent manages its own `openChildItemId`
- **Behavior:** Only one subfunction per parent can be open
- **Control:** Distributed to each dropdown item

## Data Flow

```
FunctionalStructure (Global Level 0 State)
├── FunctionalStructureSearch (Search Logic)
├── FunctionalDropdownItem (Level 0 - Functions)
│   ├── Local Child State Management
│   └── FunctionalDropdownItem (Level 1 - Subfunctions)
│       ├── Local Child State Management
│       └── FunctionalDropdownItem (Level 2+...)
```

## Key Benefits

### 1. **Separation of Concerns**
- Each component has a single, clear responsibility
- Search logic is isolated
- State management is distributed appropriately

### 2. **Maintainability**
- Easy to understand and modify
- Components are self-contained
- Clear interfaces between components

### 3. **Performance**
- Minimal re-renders due to localized state
- Efficient callback patterns
- Optimized with useCallback and useMemo

### 4. **Testability**
- Components can be tested in isolation
- Clear input/output patterns
- Minimal external dependencies

### 5. **Scalability**
- Easy to add new features
- Components can be reused elsewhere
- Clear patterns for extending functionality

## Usage Examples

### Adding New Functionality
To add new functionality, you can:
1. Add new props to the relevant component
2. Extend the callback patterns
3. Create new specialized components

### Customizing Behavior
- Modify state management in the appropriate component
- Adjust callback functions
- Override styling through props

### Testing
Each component can be tested independently:
- Mock the required callbacks
- Test state changes
- Verify rendering behavior

## Component Props

### FunctionalStructure
- No props (main component)

### FunctionalDropdownItem
- `data`: Item data object
- `level`: Nesting level (0, 1, 2...)
- `searchTargetId`: ID of search target for highlighting
- `onRef`: Callback for search functionality
- `parentPath`: Array of parent IDs
- `refetch`: Function to refetch data
- `isOpen`: Whether this item is open
- `onToggle`: Callback when item is toggled

### FunctionalStructureSearch
- `functionData`: Data array for search
- `onSuggestionClick`: Callback when suggestion is clicked
- `onClearSearch`: Callback when search is cleared

This architecture provides a solid foundation for future development while maintaining the exact same functionality as before.