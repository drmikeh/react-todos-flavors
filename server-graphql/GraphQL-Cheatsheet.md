# GraphQL Client Queries and Mutations

## Queries

```
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
    "title": "groceries",
    "completed": false
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
    "title": "groceries",
    "completed": true
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
  "id": 1
}
```