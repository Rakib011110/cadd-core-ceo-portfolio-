# Workshop API - Frontend Usage Guide

## Overview
Complete RTK Query API integration for Workshop CRUD operations with React hooks.

## Base URL
```
https://engrhachnayenahdmed-api.vercel.app/api/workshops
```

## Available Hooks

### Mutations (for CREATE, UPDATE, DELETE operations)

```typescript
// Create
useCreateWorkshopMutation()

// Update
useUpdateWorkshopMutation()
useUpdateWorkshopBySlugMutation()

// Delete
useDeleteWorkshopMutation()
useDeleteWorkshopBySlugMutation()

// Participant Management
useIncrementParticipantsMutation()
useDecrementParticipantsMutation()
```

### Queries (for READ operations)

```typescript
// Get all workshops
useGetWorkshopsQuery()

// Get single workshop
useGetWorkshopQuery(id)
useGetWorkshopBySlugQuery(slug)

// Filtered queries
useGetAvailableWorkshopsQuery()
useGetWorkshopsByCategoryQuery(category)
useGetWorkshopsByLevelQuery(level)
```

---

## Usage Examples

### 1. Create Workshop

```typescript
import { useCreateWorkshopMutation } from '../../redux/api/workshopApi';

const CreateWorkshopForm = () => {
  const [createWorkshop, { isLoading, isSuccess, error }] = useCreateWorkshopMutation();

  const handleSubmit = async (workshopData) => {
    try {
      await createWorkshop(workshopData).unwrap();
      // Success - workshop created
    } catch (err) {
      // Error handling
      console.error('Failed to create workshop:', err);
    }
  };

  return (
    // Your form JSX
  );
};
```

### 2. Get All Workshops

```typescript
import { useGetWorkshopsQuery } from '../../redux/api/workshopApi';

const WorkshopsList = () => {
  const { data: workshops, isLoading, error } = useGetWorkshopsQuery();

  if (isLoading) return <div>Loading workshops...</div>;
  if (error) return <div>Error loading workshops</div>;

  return (
    <div>
      {workshops?.data?.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
          <p>{workshop.description}</p>
          <p>Price: ${workshop.price}</p>
          <p>Level: {workshop.level}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. Get Workshop by Slug (for dynamic routes)

```typescript
import { useGetWorkshopBySlugQuery } from '../../redux/api/workshopApi';

const WorkshopDetail = ({ slug }) => {
  const { data: workshop, isLoading, error } = useGetWorkshopBySlugQuery(slug);

  if (isLoading) return <div>Loading workshop...</div>;
  if (error) return <div>Workshop not found</div>;
  if (!workshop?.data) return <div>Workshop not found</div>;

  const workshopData = workshop.data;

  return (
    <div>
      <h1>{workshopData.title}</h1>
      <p>{workshopData.description}</p>
      <p>Instructor: {workshopData.instructor}</p>
      <p>Price: ${workshopData.price}</p>
      <p>Level: {workshopData.level}</p>
      <p>Participants: {workshopData.currentParticipants}/{workshopData.maxParticipants}</p>

      {workshopData.detailedDescription && (
        <div>
          <h3>Detailed Description</h3>
          <p>{workshopData.detailedDescription}</p>
        </div>
      )}

      {workshopData.learningObjectives?.length > 0 && (
        <div>
          <h3>Learning Objectives</h3>
          <ul>
            {workshopData.learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 4. Update Workshop

```typescript
import { useUpdateWorkshopMutation } from '../../redux/api/workshopApi';

const EditWorkshopForm = ({ workshopId }) => {
  const [updateWorkshop, { isLoading }] = useUpdateWorkshopMutation();

  const handleUpdate = async (updatedData) => {
    try {
      await updateWorkshop({
        id: workshopId,
        ...updatedData
      }).unwrap();
      // Success - workshop updated
    } catch (err) {
      console.error('Failed to update workshop:', err);
    }
  };

  return (
    // Your edit form JSX
  );
};
```

### 5. Delete Workshop

```typescript
import { useDeleteWorkshopMutation } from '../../redux/api/workshopApi';

const DeleteWorkshopButton = ({ workshopId }) => {
  const [deleteWorkshop, { isLoading }] = useDeleteWorkshopMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        await deleteWorkshop(workshopId).unwrap();
        // Success - workshop deleted
      } catch (err) {
        console.error('Failed to delete workshop:', err);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Deleting...' : 'Delete Workshop'}
    </button>
  );
};
```

### 6. Get Available Workshops

```typescript
import { useGetAvailableWorkshopsQuery } from '../../redux/api/workshopApi';

const AvailableWorkshops = () => {
  const { data: workshops, isLoading } = useGetAvailableWorkshopsQuery();

  if (isLoading) return <div>Loading available workshops...</div>;

  return (
    <div>
      <h2>Available Workshops</h2>
      {workshops?.data?.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
          <p>Spots left: {workshop.maxParticipants - workshop.currentParticipants}</p>
        </div>
      ))}
    </div>
  );
};
```

### 7. Filter by Category

```typescript
import { useGetWorkshopsByCategoryQuery } from '../../redux/api/workshopApi';

const CategoryWorkshops = ({ category }) => {
  const { data: workshops } = useGetWorkshopsByCategoryQuery(category);

  return (
    <div>
      <h2>{category} Workshops</h2>
      {workshops?.data?.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
        </div>
      ))}
    </div>
  );
};
```

### 8. Filter by Level

```typescript
import { useGetWorkshopsByLevelQuery } from '../../redux/api/workshopApi';

const LevelWorkshops = ({ level }) => {
  const { data: workshops } = useGetWorkshopsByLevelQuery(level);

  return (
    <div>
      <h2>{level} Workshops</h2>
      {workshops?.data?.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
        </div>
      ))}
    </div>
  );
};
```

### 9. Participant Management

```typescript
import { useIncrementParticipantsMutation, useDecrementParticipantsMutation } from '../../redux/api/workshopApi';

const ParticipantButtons = ({ workshopId, currentParticipants, maxParticipants }) => {
  const [increment, { isLoading: isIncrementing }] = useIncrementParticipantsMutation();
  const [decrement, { isLoading: isDecrementing }] = useDecrementParticipantsMutation();

  const handleJoin = async () => {
    try {
      await increment(workshopId).unwrap();
    } catch (err) {
      alert('Failed to join workshop');
    }
  };

  const handleLeave = async () => {
    try {
      await decrement(workshopId).unwrap();
    } catch (err) {
      alert('Failed to leave workshop');
    }
  };

  return (
    <div>
      <p>Participants: {currentParticipants}/{maxParticipants}</p>
      <button
        onClick={handleJoin}
        disabled={isIncrementing || currentParticipants >= maxParticipants}
      >
        {isIncrementing ? 'Joining...' : 'Join Workshop'}
      </button>
      <button
        onClick={handleLeave}
        disabled={isDecrementing || currentParticipants <= 0}
      >
        {isDecrementing ? 'Leaving...' : 'Leave Workshop'}
      </button>
    </div>
  );
};
```

---

## Hook Return Values

### Mutation Hooks Return:
```typescript
const [mutationFunction, { isLoading, isSuccess, isError, error, data }] = useMutationHook();
```

### Query Hooks Return:
```typescript
const { data, isLoading, isError, error, refetch } = useQueryHook();
```

---

## Error Handling

```typescript
const { data, error, isLoading } = useGetWorkshopsQuery();

if (error) {
  // Handle error
  console.error('API Error:', error);

  // Check error status
  if (error.status === 404) {
    // Not found
  } else if (error.status === 400) {
    // Bad request
  }
}
```

---

## Loading States

```typescript
const { isLoading } = useGetWorkshopsQuery();

if (isLoading) {
  return <div>Loading workshops...</div>;
}
```

---

## Cache Management

RTK Query automatically handles caching and invalidation:

- **Queries** provide cached data and automatically refetch when needed
- **Mutations** invalidate relevant cache tags, causing related queries to refetch
- Use `refetch()` manually if needed: `const { refetch } = useGetWorkshopsQuery();`

---

## Workshop Data Structure

```typescript
interface Workshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  instructor: string;
  image: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  slug: string;
  detailedDescription?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  whatYouWillLearn?: string[];
  instructorBio?: string;
  instructorImage?: string;
  curriculum?: {
    title: string;
    description: string;
    duration: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Best Practices

1. **Use appropriate hooks**: Use queries for reading data, mutations for modifying data
2. **Handle loading states**: Always show loading indicators during API calls
3. **Error handling**: Implement proper error handling for all API calls
4. **Optimistic updates**: RTK Query handles cache invalidation automatically
5. **Type safety**: All hooks are fully typed with TypeScript
6. **Conditional rendering**: Check for data existence before rendering

---

## Complete Component Example

```typescript
import React, { useState } from 'react';
import {
  useGetWorkshopsQuery,
  useCreateWorkshopMutation,
  useUpdateWorkshopMutation,
  useDeleteWorkshopMutation,
  useIncrementParticipantsMutation
} from '../../redux/api/workshopApi';

const WorkshopsManager = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Queries
  const { data: workshops, isLoading, error } = useGetWorkshopsQuery();

  // Mutations
  const [createWorkshop] = useCreateWorkshopMutation();
  const [updateWorkshop] = useUpdateWorkshopMutation();
  const [deleteWorkshop] = useDeleteWorkshopMutation();
  const [joinWorkshop] = useIncrementParticipantsMutation();

  const handleCreate = async (workshopData) => {
    try {
      await createWorkshop(workshopData).unwrap();
      // Success toast or redirect
    } catch (err) {
      // Error handling
    }
  };

  const handleUpdate = async (workshopData) => {
    try {
      await updateWorkshop({
        id: selectedWorkshop._id,
        ...workshopData
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      // Error handling
    }
  };

  const handleDelete = async (workshopId) => {
    if (window.confirm('Delete this workshop?')) {
      try {
        await deleteWorkshop(workshopId).unwrap();
      } catch (err) {
        // Error handling
      }
    }
  };

  const handleJoin = async (workshopId) => {
    try {
      await joinWorkshop(workshopId).unwrap();
    } catch (err) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading workshops</div>;

  return (
    <div>
      <h1>Workshop Management</h1>

      {/* Create/Edit Form */}
      {/* Workshop List */}
      {workshops?.data?.map(workshop => (
        <div key={workshop._id}>
          <h3>{workshop.title}</h3>
          <p>{workshop.description}</p>
          <p>Participants: {workshop.currentParticipants}/{workshop.maxParticipants}</p>
          <button onClick={() => handleJoin(workshop._id)}>Join</button>
          <button onClick={() => setSelectedWorkshop(workshop)}>Edit</button>
          <button onClick={() => handleDelete(workshop._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default WorkshopsManager;
```

---

## Status: ✅ COMPLETE AND READY TO USE!

All workshop API endpoints are now available as React hooks with full TypeScript support, error handling, and automatic cache management.