
document.addEventListener('DOMContentLoaded', function() {

    const commentInput = document.getElementById('commentInput');
    const addButton = document.getElementById('addButton');
    const commentsList = document.getElementById('commentsList');
    

    loadComments();
    
    // Agregar evento al botón de agregar comentario
    addButton.addEventListener('click', addComment);
    
    // También permitir agregar comentario con la tecla Enter (manteniendo Shift para nueva línea)
    commentInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addComment();
        }
    });
    
    // Función para agregar un nuevo comentario
    function addComment() {
        // Obtener el texto del comentario y eliminar espacios en blanco innecesarios
        const commentText = commentInput.value.trim();
        
        // Verificar si el comentario no está vacío
        if (commentText) {
            // Crear un objeto con el comentario y su timestamp
            const newComment = {
                text: commentText,
                timestamp: new Date().toISOString() // Guardar la fecha y hora actual
            };
            
            // Agregar el comentario a la interfaz
            createCommentElement(newComment);
            
            // Guardar el comentario en el almacenamiento local
            saveComment(newComment);
            
            // Limpiar el campo de entrada
            commentInput.value = '';
        }
    }
    
    // Función para crear el elemento HTML del comentario
    function createCommentElement(comment) {
        // Crear el elemento contenedor del comentario
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        
        // Crear el encabezado del comentario (para la fecha y el botón de eliminar)
        const commentHeader = document.createElement('div');
        commentHeader.className = 'comment-header';
        
        // Formatear la fecha y hora
        const date = new Date(comment.timestamp);
        const formattedDate = `${date.toLocaleDateString()} a las ${date.toLocaleTimeString()}`;
        
        // Crear el timestamp del comentario
        const timestampElement = document.createElement('div');
        timestampElement.className = 'comment-timestamp';
        timestampElement.textContent = `Publicado el ${formattedDate}`;
        commentHeader.appendChild(timestampElement);
        
        // Crear el botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function() {
            deleteComment(comment.timestamp, commentElement);
        });
        commentHeader.appendChild(deleteButton);
        
        // Crear el contenido del comentario
        const commentTextElement = document.createElement('div');
        commentTextElement.className = 'comment-text';
        commentTextElement.textContent = comment.text;
        
        // Agregar todos los elementos al comentario
        commentElement.appendChild(commentHeader);
        commentElement.appendChild(commentTextElement);
        
        // Agregar el comentario a la lista (al principio para que los más recientes aparezcan primero)
        commentsList.insertBefore(commentElement, commentsList.firstChild);
    }
    
    // Función para guardar un comentario en el almacenamiento local
    function saveComment(comment) {
        // Obtener comentarios existentes o inicializar un array vacío
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // Agregar el nuevo comentario
        comments.push(comment);
        
        // Guardar la lista actualizada
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    
    // Función para eliminar un comentario
    function deleteComment(timestamp, commentElement) {
        // Obtener comentarios del almacenamiento local
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // Filtrar los comentarios para eliminar el que coincida con el timestamp
        const updatedComments = comments.filter(comment => comment.timestamp !== timestamp);
        
        // Guardar la lista actualizada
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        
        // Eliminar el elemento del DOM
        commentsList.removeChild(commentElement);
    }
    
    // Función para cargar comentarios guardados
    function loadComments() {
        // Obtener comentarios del almacenamiento local
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // Ordenar comentarios del más reciente al más antiguo
        comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Agregar cada comentario a la interfaz
        comments.forEach(comment => {
            createCommentElement(comment);
        });
    }
});
