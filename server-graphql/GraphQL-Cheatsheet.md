# GraphQL Client Queries and Mutations

## Queries

```
query todos {
  todos {
    id,
    title,
    completed
  }
}

query message {
  message
}

query messageAndTodos {
  message,
  todos {
    id,
    title,
    completed
  }
}
```

## Mutations

### Create Todo

```
mutation createTodo($todo: TodoInput!) {
  createTodo(todo: $todo) {
    id,
    title,
    completed
  }
}
```

Query Variables:

```
{
  "todo": {
    "title": "Learn TDD"
  }
}
```

### Update Todo

```
mutation updateTodo($id: Int!, $todo: TodoInput!) {
  updateTodo(id: $id, todo: $todo) {
    id,
    title
    completed
  }
}
```

Query Variables:

```
{
  "id": 3,
  "todo": {
    "title": "Learn go",
    "completed": false
  }
}
```

### Destroy Todo

```
mutation destroyTodo($id: Int!) {
  destroyTodo(id: $id) {
    id,
    title
    completed
  }
}
```

Query Variables:

```
{
  "id": 2
}
```