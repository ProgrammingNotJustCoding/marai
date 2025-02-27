package constants

type Error struct {
	Status        int    `json:"status"`
	Message       string `json:"message"`
	PrettyMessage string `json:"prettyMessage"`
}

var (
	ErrBadRequest = Error{
		Status:        400,
		Message:       "Bad Request",
		PrettyMessage: "The request was invalid or cannot be served",
	}
	ErrUnauthorized = Error{
		Status:        401,
		Message:       "Unauthorized",
		PrettyMessage: "The request has not been applied because it lacks valid authentication credentials for the target resource",
	}
	ErrNotFound = Error{
		Status:        404,
		Message:       "Not Found",
		PrettyMessage: "The requested resource was not found",
	}
	ErrConflict = Error{
		Status:        409,
		Message:       "Conflict",
		PrettyMessage: "The request could not be completed due to a conflict with the current state of the target resource",
	}
	ErrInternalServer = Error{
		Status:        500,
		Message:       "Internal Server Error",
		PrettyMessage: "The server has encountered a situation it doesn't know how to handle",
	}
)
