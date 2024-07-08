package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title"`
	Done  bool               `json:"done"`
	Body  string             `json:"body"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello, World!")

	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	defer client.Disconnect(context.Background())

	if err != nil {
		log.Fatal("Error connecting to MongoDB", err)
	}

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal("Error pinging MongoDB", err)
	}

	fmt.Println("Connected to MongoDB!")

	collection = client.Database("golang_db").Collection("todos")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", ceateTodo)
	app.Put("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	PORT := os.Getenv("PORT")

	if PORT == "" {
		PORT = "5000"
	}

	log.Fatal(app.Listen(":" + PORT))
}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err = cursor.All(context.Background(), &todos); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(200).JSON(todos)
}
func ceateTodo(c *fiber.Ctx) error {
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Body is required",
		})
	}

	if todo.Title == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Title is required",
		})
	}

	insertResult, err := collection.InsertOne(context.Background(), todo)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)
}

func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	filter := bson.M{
		"_id": objectID,
	}

	findReasul := collection.FindOne(context.Background(), filter)

	todo := new(Todo)

	if err := findReasul.Decode(todo); err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "todo not found",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"done": !todo.Done,
		},
	}

	updateResult, err := collection.UpdateOne(context.Background(), filter,
		update)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{
			"error": "todo not found",
		})
	}

	return c.Status(202).JSON(fiber.Map{
		"status": "todo updated",
	})
}

func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}
	filter := bson.M{
		"_id": objectID,
	}

	deleteResult, err := collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if deleteResult.DeletedCount == 0 {
		return c.Status(404).JSON(fiber.Map{
			"error": "todo not found",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "todo deleted",
	})
}
