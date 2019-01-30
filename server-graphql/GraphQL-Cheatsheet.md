# GraphQL Client Queries and Mutations

## Queries

```
query messageAndTodos {
  message,
  todos {
    id,
    text,
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
    text,
    completed
  }
}
```

Query Variables:

```
{
  "todo": {
    "text": "groceries",
    "completed": false
  }
}
```

### Update Todo

```
mutation updateTodo($id: Int!, $todo: TodoInput!) {
  updateTodo(id: $id, todo: $todo) {
    id,
    text
    completed
  }
}
```

Query Variables:

```
{
  "id": 3,
  "todo": {
    "text": "groceries",
    "completed": true
  }
}
```

### Destroy Todo

```
mutation destroyTodo($id: Int!) {
  destroyTodo(id: $id) {
    id,
    text
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