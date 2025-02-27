package constants

type Response struct {
	Status        int         `json:"status"`
	Message       string      `json:"message"`
	PrettyMessage string      `json:"prettyMessage"`
	Data          interface{} `json:"data,omitempty"`
}
