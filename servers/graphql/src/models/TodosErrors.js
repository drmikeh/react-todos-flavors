const TodosErrors = {
    notFound: {
        code: 404,
        message: 'Todo not found.'
    },
    invalidTitle: {
        code: 422,
        message: 'Todo needs a valid title.'
    }
};

module.exports = TodosErrors;
