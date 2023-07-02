package main

import (
	"github.com/gofiber/fiber/v2"
)
func main() {
	app := fiber.New()

	app.Static("/", "./public") 

	app.Listen(":80")
}