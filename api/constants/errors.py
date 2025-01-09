errors = {
    'invalid_request': {
        'status': 400,
        'message': 'Invalid request',
        'prettyMessage': 'The request you made was invalid',
    },
    'unauthorized': {
        'status': 401,
        'message': 'Unauthorized',
        'prettyMessage': 'You are not authorized to access this resource',
    },
    'not_found': {
        'status': 404,
        'message': 'Resource not found',
        'prettyMessage': 'The requested resource was not found',
    },
    'method_not_allowed': {
        'status': 405,
        'message': 'Method not allowed',
        'prettyMessage': 'The requested method is not allowed on this route',
    },
    'conflict': {
        'status': 409,
        'message': 'Conflict',
        'prettyMessage': 'A conflict occurred while processing the request',
    },
    'internal_server_error': {
        'status': 500,
        'message': 'Internal server error',
        'prettyMessage': 'An internal server error occurred',
    }
}
