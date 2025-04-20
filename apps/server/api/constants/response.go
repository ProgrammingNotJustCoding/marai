package constants

type Response struct {
	Status        int         `json:"status"`
	Message       string      `json:"message"`
	PrettyMessage string      `json:"prettyMessage"`
	Data          interface{} `json:"data,omitempty"`
}

type PaginatedResponse struct {
	Status        int         `json:"status"`
	Message       string      `json:"message"`
	PrettyMessage string      `json:"prettyMessage,omitempty"`
	Data          interface{} `json:"data,omitempty"`
	Total         int64       `json:"total"`
	Page          int         `json:"page"`
	PageSize      int         `json:"pageSize"`
}
