import express from "express";
import {TodoListService} from "./TodoListService";

const port = 8080;

const server: express.Application = express();
server.use(express.json());
const service = new TodoListService();

server.get("/", (req, res) => {
    res.send([
        {
            path: "/api/todoList",
            method: "GET",
            description: "returns todoList summary"
        },
        {
            path: "/api/todoList",
            method: "POST",
            description: "add todoList"
        },
        {
            path: "/api/todoList/:id",
            method: "GET",
            description: "returns todoList with given id"
        },
        {
            path: "/api/todoList/:id",
            method: "PUT",
            description: "updated a todo list"
        },
        {
            path: "/api/todoList/:id/items",
            method: "POST",
            description: "adds an item to a specific list"
        },
    ]);
})

server.get("/api/todoList", (req, res) => {
    res.json(service.getTodoLists())
});
server.get("/api/todoList/:id", (req, res) => {
    const list = service.getTodoList(req.params["id"]);
    if (list === undefined) {
        res.status(404);
        res.send("list with given id does not exist")
        return
    }
    res.json(service.getTodoList(req.params["id"]))
});
server.post("/api/todoList/", (req, res) => {
    const updatedListPromise = service.addTodoList(req.body.name, req.body.description);

    updatedListPromise
        .then(list => {
            res.json(list)
        })
        .catch(e => {
            res.status(400);
            res.send(e)
        });
});
server.put("/api/todoList/:id", (req, res) => {
    service.updateTodoList(req.params["id"], req.body.name, req.body.description).then(list => {
        if (list === undefined) {
            res.status(404);
            res.send("list with given id does not exist")
            return
        }
        res.json(service.getTodoList(req.params["id"]))
    })
        .catch(e => {
            res.status(400);
            res.send(e)
        });

});

server.post("/api/todoList/:id/items", (req, res) => {
    const updatedListPromise = service.addListItem(req.params.id, req.body.name, req.body.priority);

    updatedListPromise
        .then(listItem => {
            if (listItem === undefined) {
                res.status(404);
                res.send("could not found list with given id");
                return;
            }
            res.json(listItem)
        })
        .catch(e => {
            res.status(400);
            res.send(e)
        });
});
server.listen(port, () => {
    console.log("oda server started on port: " + port);
});

