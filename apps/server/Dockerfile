ARG GO_VERSION=1.24
FROM golang:${GO_VERSION}-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod download || \
    go mod download

COPY api/ ./api
COPY cmd/ ./cmd
COPY internal/ ./internal
COPY go.mod .
COPY go.sum .

ARG TARGETARCH
RUN --mount=type=cache,target=/root/.cache/go-build/ \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server cmd/main.go || \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server cmd/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=build /bin/server /app/server
COPY .env.local /app/.env

EXPOSE 8080

ENTRYPOINT ["/app/server"]
