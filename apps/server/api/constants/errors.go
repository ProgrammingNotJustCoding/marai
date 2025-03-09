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
	// TODO: In future remove this specific error and make a custom error module.
	ErrDuplicateEmail = Error{
		Status:        409,
		Message:       "Duplicate Email",
		PrettyMessage: "The email address is already in use",
	}
	ErrInternalServer = Error{
		Status:        500,
		Message:       "Internal Server Error",
		PrettyMessage: "The server has encountered a situation it doesn't know how to handle",
	}
	ErrForbidden = Error{
		Status:        403,
		Message:       "Forbidden",
		PrettyMessage: "You do not have permission to access this resource",
	}

	ErrNoPermission = Error{
		Status:        403,
		Message:       "Permission Denied",
		PrettyMessage: "You do not have sufficient permissions to perform this action",
	}

	ErrNotOwner = Error{
		Status:        403,
		Message:       "Owner Permission Required",
		PrettyMessage: "This action can only be performed by the law firm owner",
	}

	ErrNotAdmin = Error{
		Status:        403,
		Message:       "Admin Permission Required",
		PrettyMessage: "This action can only be performed by law firm administrators",
	}
)
