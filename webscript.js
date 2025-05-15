let users = [];
        let userIdToDelete = null;
        let userIdToEdit = null;

        // Fetch users from JSONPlaceholder API
        async function fetchUsers() {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch data from API');
                }
                const apiUsers = await response.json();
                // Duplicate users to get 40 rows
                for (let i = 0; i < 4; i++) {
                    apiUsers.forEach(user => {
                        users.push({
                            ...user,
                            id: user.id + (i * 10) // Ensure unique IDs
                        });
                    });
                }
                populateTable();
            } catch (error) {
                document.getElementById('errorMessage').textContent = 'Error: ' + error.message;
            }
        }

        // Populate table with user data
        function populateTable() {
            const tableBody = document.getElementById('userTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.address.street}, ${user.address.suite}, ${user.address.city}</td>
                    <td>
                        <button class="edit-btn" onclick="openEditModal(${user.id})">Edit</button>
                        <button class="delete-btn" onclick="openDeleteModal(${user.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Open the insert modal
        function openInsertModal() {
            console.log('Opening insert modal');
            document.getElementById('insertModal').style.display = 'flex';
        }

        // Close the insert modal
        function closeModal() {
            console.log('Closing insert modal');
            document.getElementById('insertModal').style.display = 'none';
            // Clear form inputs
            document.getElementById('newId').value = '';
            document.getElementById('newName').value = '';
            document.getElementById('newUsername').value = '';
            document.getElementById('newEmail').value = '';
            document.getElementById('newAddress').value = '';
        }

        // Submit new user data
        function submitNewUser() {
            const newUser = {
                id: parseInt(document.getElementById('newId').value),
                name: document.getElementById('newName').value,
                username: document.getElementById('newUsername').value,
                email: document.getElementById('newEmail').value,
                address: {
                    street: document.getElementById('newAddress').value,
                    suite: '',
                    city: ''
                }
            };

            // Validate inputs
            if (!newUser.id || !newUser.name || !newUser.username || !newUser.email || !newUser.address.street) {
                alert('Please fill in all fields');
                return;
            }

            // Check for duplicate ID
            if (users.some(user => user.id === newUser.id)) {
                alert('ID already exists. Please use a unique ID.');
                return;
            }

            users.push(newUser);
            populateTable();
            closeModal();
        }

        // Open the edit modal
        function openEditModal(userId) {
            console.log(`Opening edit modal for user ID: ${userId}`);
            userIdToEdit = userId;
            const user = users.find(user => user.id === userId);
            if (user) {
                document.getElementById('editId').value = user.id;
                document.getElementById('editName').value = user.name;
                document.getElementById('editUsername').value = user.username;
                document.getElementById('editEmail').value = user.email;
                document.getElementById('editAddress').value = `${user.address.street}, ${user.address.suite}, ${user.address.city}`;
                document.getElementById('editModal').style.display = 'flex';
            }
        }

        // Close the edit modal
        function closeEditModal() {
            console.log('Closing edit modal');
            document.getElementById('editModal').style.display = 'none';
            userIdToEdit = null;
        }

        // Submit edited user data
        function submitEditUser() {
            const updatedUser = {
                id: parseInt(document.getElementById('editId').value),
                name: document.getElementById('editName').value,
                username: document.getElementById('editUsername').value,
                email: document.getElementById('editEmail').value,
                address: {
                    street: document.getElementById('editAddress').value,
                    suite: '',
                    city: ''
                }
            };

            // Validate inputs
            if (!updatedUser.id || !updatedUser.name || !updatedUser.username || !updatedUser.email || !updatedUser.address.street) {
                alert('Please fill in all fields');
                return;
            }

            // Check for duplicate ID (excluding the current user)
            if (users.some(user => user.id === updatedUser.id && user.id !== userIdToEdit)) {
                alert('ID already exists. Please use a unique ID.');
                return;
            }

            // Update the user in the users array
            users = users.map(user => user.id === userIdToEdit ? updatedUser : user);
            console.log(`User with ID ${userIdToEdit} updated`);
            populateTable();
            closeEditModal();
        }

        // Open the delete confirmation modal
        function openDeleteModal(userId) {
            console.log(`Opening delete modal for user ID: ${userId}`);
            userIdToDelete = userId;
            document.getElementById('deleteModal').style.display = 'flex';
        }

        // Close the delete confirmation modal
        function closeDeleteModal() {
            console.log('Closing delete modal');
            document.getElementById('deleteModal').style.display = 'none';
            userIdToDelete = null;
        }

        // Confirm deletion
        function confirmDelete() {
            console.log(`Confirming deletion for user ID: ${userIdToDelete}`);
            if (userIdToDelete !== null) {
                try {
                    users = users.filter(user => user.id !== userIdToDelete);
                    console.log(`User with ID ${userIdToDelete} deleted. Remaining users: ${users.length}`);
                    populateTable();
                    closeDeleteModal();
                } catch (error) {
                    document.getElementById('errorMessage').textContent = 'Error deleting row: ' + error.message;
                }
            }
        }

        // Fetch data when the page loads
        document.addEventListener('DOMContentLoaded', fetchUsers);