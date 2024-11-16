const API_URL = "http://localhost:8000/users";

// Function to create a remove button for each user
function createRemoveButton(userId) {
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.setAttribute("data-id", userId);

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("material-icons");
    iconSpan.textContent = "delete_outline";

    removeButton.appendChild(iconSpan);

    removeButton.addEventListener("click", () => {
        if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
            executeDelete(userId, removeButton);
        }
    });

    return removeButton;
}

// Function to execute the delete request for a user
async function executeDelete(userId, button) {
    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        });
        if (response.ok) {
            const userElement = button.closest('.user-wrapper');
            userElement.remove(); 
        } else {
            alert('Użytkownik nie został usunięty. Spróbuj ponownie.');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Wystąpił błąd podczas próby usunięcia użytkownika.');
    }
}

// Function to fetch and display the users
async function getItems() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const users = await response.json(); // Parse JSON data
        console.log(users);

        displayUsers(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Function to display the users in the DOM
function displayUsers(users) {
    const userList = document.querySelector(".users-wrapper");
    userList.innerHTML = "";

    users.forEach(user => {
        const userElement = createUserElement(user);
        userList.appendChild(userElement);
    });
}

// Function to create user HTML element
function createUserElement(user) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("user-wrapper");

    const userInfo = createUserInfo(user);
    const deleteButton = createRemoveButton(user.id);

    wrapper.appendChild(userInfo);
    wrapper.appendChild(deleteButton);

    return wrapper;
}

// Function to create user info HTML
function createUserInfo(user) {
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-wrapper-infos");

    const nameDiv = document.createElement("div");
    nameDiv.textContent = `${user.first_name} ${user.last_name}`;
    nameDiv.classList.add("user-wrapper-infos-name");

    const roleDiv = document.createElement("div");
    roleDiv.textContent = user.role;
    roleDiv.classList.add("user-wrapper-infos-role");

    userInfo.appendChild(nameDiv);
    userInfo.appendChild(roleDiv);

    return userInfo;
}

// Event listener for form submission to add a new user
document.getElementsByClassName('submit-button')[0].addEventListener('click', function(event) {
    event.preventDefault();
    sendPostRequest();
});

// Function to send a POST request to add a new user
async function sendPostRequest() {
    const userData = gatherUserData();

    const validationError = validateUserData(userData);
    if (validationError) {
        alert(validationError);
        return;
    }

    if (!validatePrivacyPolicy(userData.privacyPolicy)) {
        return;
    }

    try {
        const response = await sendRequest(API_URL, userData);
        const newUsers = await handleResponse(response);
        console.log(newUsers);
        displayUsers(newUsers);
    } catch (error) {
        handleError(error);
    }
}

// Function to gather user data from the form
function gatherUserData() {
    return {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        role: document.getElementById("role").value.trim(),
        privacyPolicy: document.getElementById("privacyPolicy").checked
    };
}

// Function to validate the user data
function validateUserData(userData) {
    if (!userData.firstName) {
        return "First name cannot be empty.";
    }
    if (!userData.lastName) {
        return "Last name cannot be empty.";
    }
    if (!userData.role) {
        return "Role cannot be empty.";
    }
    return null;
}

// Function to validate privacy policy agreement
function validatePrivacyPolicy(isAgreed) {
    if (!isAgreed) {
        alert("You must agree to the privacy policy.");
        return false;
    }
    return true;
}

// Function to send the actual POST request
async function sendRequest(url, data) {
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role
        })
    });
}

// Function to handle the response from the server after adding a user
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

// Function to handle errors
function handleError(error) {
    console.error('Error:', error);
}

// Fetch and display users when the page loads
getItems();
