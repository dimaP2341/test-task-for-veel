import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Todo } from './types/api'
import { deleteTodo, getTodos, postTodo } from './utils/api'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'

export function Todos() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })

  const addTodoMutation = useMutation<Todo, Error, Todo>({
    mutationFn: (newTodo: Todo) => postTodo(newTodo),
    onSuccess: (data, newTodo) => {
      const updatedTodo = { ...newTodo, id: uuidv4() }
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => [...old, updatedTodo])
      toast.success('Todo added successfully!')
    },
    onError: (error) => {
      toast.error(`Error adding todo: ${error.message}`)
    },
  })

  const deleteTodoMutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['todos'], (old: Todo[] = []) => old.filter((todo) => todo.id !== id))
      toast.success('Todo deleted successfully!')
    },
    onError: (error) => {
      toast.error(`Error deleting todo: ${error.message}`)
    },
  })

  if (query.isLoading) return <p>Loading...</p>
  if (query.isError) return <p>Error: {query.error.message}</p>

  const handleAddTodo = () => {
    if (title.trim() === '') return

    const newTodo: Todo = {
      userId: 1,
      id: Number(uuidv4()),
      title,
      completed: false,
    }

    addTodoMutation.mutate(newTodo)
    setTitle('')
  }

  return (
    <div className="h-screen flex flex-col items-center justify-start gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl text-center">Add todo</h1>
        <div className="flex gap-2">
          <input
            value={title}
            className="px-2 w-full text-black"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter title"
          />
          <button className="bg-white text-black px-4 rounded-md" onClick={handleAddTodo}>
            Add
          </button>
        </div>
      </div>
      <ul className="overflow-scroll space-y-2">
        {query.data?.map((todo: Todo) => (
          <li key={todo.id} className="flex gap-2">
            {todo.title}
            <div className="space-x-2">
              <span className="cursor-pointer text-red-600" onClick={() => deleteTodoMutation.mutate(todo.id)}>
                X
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
