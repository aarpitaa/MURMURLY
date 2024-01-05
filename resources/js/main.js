console.log("main.js running");

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector('.login-form');

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?$])[A-Za-z\d!?$]{8,}$/;
        return regex.test(password);
    }

    // Attach event listener only if registerForm exists
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            const emailInput = document.querySelector('input[name="email"]');
            const passwordInput = document.querySelector('input[name="password"]');
            const repasswordInput = document.querySelector('input[name="repassword"]');
    
            let valid = true;
            let errorMessages = [];
    
            // Check if email is in valid format
            if (!validateEmail(emailInput.value)) {
                errorMessages.push('Invalid email format.');
                valid = false;
            }
    
            // Check if passwords match
            if (passwordInput.value !== repasswordInput.value) {
                errorMessages.push('Passwords do not match.');
                valid = false;
            }
    
            // Check if the password is strong
            if (!validatePassword(passwordInput.value)) {
                errorMessages.push('Password does not meet criteria.');
                valid = false;
            }
    
            if (!valid) {
                event.preventDefault(); // Prevent form submission
                // Display error message to the user
                alert(errorMessages.join('\n'));
            }
        });
    }

    // Like button event listener
    const likeIcons = document.querySelectorAll('.like-icon');

    likeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const likeCountSpan = document.getElementById(`like-count-${postId}`);
            fetch(`/posts/${postId}/like`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if(data.likes !== undefined) {
                        likeCountSpan.textContent = data.likes;
                        // Change the heart to solid
                        icon.classList.remove('fa-regular', 'fa-heart');
                        icon.classList.add('fa-solid', 'fa-heart');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    });

    // Character counter for the title input in the create post form
    const titleInputCreatePost = document.querySelector('input#title');
    const titleCounterCreatePost = document.querySelector('span#title-counter');

    if (titleInputCreatePost && titleCounterCreatePost) {
        titleInputCreatePost.addEventListener('input', function() {
            titleCounterCreatePost.textContent = `${this.value.length}/70 characters`;
        });
    }

    // Character counter for the description textarea in the create post form
    const descriptionInputCreatePost = document.querySelector('textarea#description');
    const descriptionCounterCreatePost = document.querySelector('span#description-counter');

    if (descriptionInputCreatePost && descriptionCounterCreatePost) {
        descriptionInputCreatePost.addEventListener('input', function() {
            descriptionCounterCreatePost.textContent = `${this.value.length}/200 characters`;
        });
    }

    // Toggle the visibility of the "sort" dropdown menu
    const sortButton = document.querySelector(".sort-btn");
    const dropdownMenu = document.querySelector(".sort-dropdown");

    console.log("sort button clicked!!");

    if (sortButton && dropdownMenu) {
        sortButton.addEventListener("click", function() {
            dropdownMenu.classList.toggle("hidden");
        });
    } else {
        console.error("Sort button or dropdown menu not found");
    }

    // Click event listener for sort options
    const sortOptions = document.querySelectorAll('.sort-dropdown li[data-sort]');

    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortType = this.getAttribute('data-sort');
            window.location.href = `/dashboard?sort=${sortType}`;
        });
    });

    // Edit post event listener
    const editIcons = document.querySelectorAll('.edit-post');
    const saveEditIcons = document.querySelectorAll('.save-edit');

    editIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            toggleEditState(postId, true);
        });
    });

    saveEditIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const postTitle = document.querySelector(`.post-title[data-post-id="${postId}"]`);
            const postDescription = document.querySelector(`.post-description[data-post-id="${postId}"]`);

            updatePost(postId, postTitle.textContent, postDescription.textContent);
            toggleEditState(postId, false);
        });
    });

    function toggleEditState(postId, isEditing) {
        const postTitle = document.querySelector(`.post-title[data-post-id="${postId}"]`);
        const postDescription = document.querySelector(`.post-description[data-post-id="${postId}"]`);
        const editIcon = document.querySelector(`.edit-post[data-post-id="${postId}"]`);
        const saveIcon = document.querySelector(`.save-edit[data-post-id="${postId}"]`);

        postTitle.setAttribute('contenteditable', isEditing);
        postDescription.setAttribute('contenteditable', isEditing);

        if (isEditing) {
            editIcon.style.display = 'none';
            saveIcon.style.display = 'inline';
        } else {
            editIcon.style.display = 'inline';
            saveIcon.style.display = 'none';
        }
    }

    function updatePost(postId, title, description) {
        fetch(`/posts/update/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post updated:', data);
        })
        .catch(error => console.error('Error updating post:', error));
    }

    // Delete post event listener
    const deleteIcons = document.querySelectorAll('.delete-post');

    deleteIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            if (confirm('Are you sure you want to delete this post?')) {
                deletePost(postId);
            }
        });
    });

    function deletePost(postId) {
        fetch(`/posts/delete/${postId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                window.location.reload(); // Reload page after deletion
            } else {
                console.error('Error deleting post');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Event listener for "Logout" button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('/logout', { method: 'POST' })
                .then(() => window.location.href = '/')
                .catch(error => console.error('Error:', error));
        });
    }
});
