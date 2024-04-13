const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())



const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "user not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

/*
const myFirstMiddleware = (request, response, next) => {
    console.log('fui chamado')

    next(   )
}

app.use(myFirstMiddleware)
*/

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    try {
    const { name, age } = request.body

        if (age < 18) throw new Error("Only allowed users over 18 years old")

    const user = { id: uuid.v4(), name, age }

        users.push(user)

    return response.status(201).json(user)
    } catch (err) {
        return response.status(500).json({ error: err.message })
    }
})

app.put('/users/:id', checkUserId, (request, response) => {

    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const upadateUsers = { id, name, age }


    users[index] = upadateUsers
    console.log(index)

    return response.json(upadateUsers)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})









//http://127.0.0.1:3000/users

app.listen(port, () => {
    console.log(`Server started on port ${port} 🚀`)
})
