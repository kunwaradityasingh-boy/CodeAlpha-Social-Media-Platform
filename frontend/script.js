const API = "http://localhost:5000/api";

let token = localStorage.getItem("token");
let currentUser = JSON.parse(localStorage.getItem("user") || "null");

if (currentUser && !currentUser._id) {
  currentUser._id = currentUser.id;
}

// =========================
// PAGE SECTIONS
// =========================

function showSection(section) {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("registerSection").classList.add("hidden");
  document.getElementById("homeSection").classList.add("hidden");
  document.getElementById("profileSection").classList.add("hidden");

  if (section === "home") {
    document.getElementById("homeSection").classList.remove("hidden");
    loadPosts();
  }

  if (section === "profile") {
    document.getElementById("profileSection").classList.remove("hidden");
    loadProfile();
  }
}

// =========================
// LOGIN / REGISTER UI
// =========================

function showRegister() {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("registerSection").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

// =========================
// REGISTER
// =========================

async function registerUser() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration successful! Please login.");

    showLogin();

    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// LOGIN
// =========================

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    token = data.token;

    currentUser = data.user;

    if (currentUser && !currentUser._id) {
      currentUser._id = currentUser.id;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(currentUser));

    alert("Login successful!");

    document.querySelector(".navbar").style.display = "flex";

    showSection("home");
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// LOAD POSTS
// =========================

async function loadPosts() {
  try {
    const response = await fetch(`${API}/posts`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load posts");
    }

    const container = document.getElementById("postsContainer");

    container.innerHTML = "";

    if (!data.posts || data.posts.length === 0) {
      container.innerHTML = "<p>No posts available.</p>";
      return;
    }

    data.posts.forEach((post) => {
      const authorName = post.author?.name || "Unknown User";

      const likesCount = post.likes?.length || 0;

      const postElement = document.createElement("div");

      postElement.className = "post-card";

      postElement.innerHTML = `
                <div class="post-author">
                    ${escapeHTML(authorName)}
                </div>

                <div class="post-content">
                    ${escapeHTML(post.content)}
                </div>

                <div class="post-actions">

                    <button onclick="likePost('${post._id}')">
                        ❤️ Like (${likesCount})
                    </button>

                    <button onclick="loadComments('${post._id}')">
                        💬 Comments
                    </button>

                    ${
                      currentUser &&
                      post.author &&
                      post.author._id === (currentUser._id || currentUser.id)
                        ? `<button onclick="deletePost('${post._id}')">
                            🗑️ Delete
                        </button>`
                        : ""
                    }

                </div>

                <div id="comments-${post._id}" class="comments-area"></div>
            `;

      container.appendChild(postElement);
    });
  } catch (error) {
    console.error(error);
    alert("Failed to load posts");
  }
}

// =========================
// CREATE POST
// =========================

async function createPost() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const content = document.getElementById("postContent").value.trim();

  if (!content) {
    alert("Please write something");
    return;
  }

  try {
    const response = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        author: currentUser._id || currentUser.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Post creation failed");
    }

    document.getElementById("postContent").value = "";

    alert("Post created successfully!");

    loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// LIKE / UNLIKE
// =========================

async function likePost(postId) {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  try {
    const response = await fetch(`${API}/posts/${postId}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser._id || currentUser.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Like failed");
    }

    loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// DELETE POST
// =========================

async function deletePost(postId) {
  if (!confirm("Delete this post?")) {
    return;
  }

  try {
    const response = await fetch(`${API}/posts/${postId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Delete failed");
    }

    alert("Post deleted successfully!");

    loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// LOAD COMMENTS
// =========================

async function loadComments(postId) {
  const area = document.getElementById(`comments-${postId}`);

  try {
    const response = await fetch(`${API}/posts/${postId}/comments`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load comments");
    }

    area.innerHTML = "";

    if (!data.comments || data.comments.length === 0) {
      area.innerHTML = "<p>No comments yet.</p>";
    } else {
      data.comments.forEach((comment) => {
        const commentDiv = document.createElement("div");

        commentDiv.innerHTML = `
                    <p>
                        <strong>
                            ${escapeHTML(comment.author?.name || "User")}
                        </strong>
                        :
                        ${escapeHTML(comment.content)}
                    </p>
                `;

        area.appendChild(commentDiv);
      });
    }

    if (currentUser) {
      area.innerHTML += `
                <input
                    id="comment-input-${postId}"
                    placeholder="Write a comment..."
                >

                <button onclick="addComment('${postId}')">
                    Add Comment
                </button>
            `;
    }
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// ADD COMMENT
// =========================

async function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);

  const content = input.value.trim();

  if (!content) {
    alert("Write a comment first");
    return;
  }

  try {
    const response = await fetch(`${API}/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        author: currentUser._id || currentUser.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Comment failed");
    }

    input.value = "";

    loadComments(postId);
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// PROFILE
// =========================

async function loadProfile() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  try {
    const response = await fetch(`${API}/users/${currentUser._id}/profile`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load profile");
    }

    const profile = data.profile;

    document.getElementById("profileName").textContent = profile.name || "User";

    document.getElementById("profileEmail").textContent = profile.email || "";

    document.getElementById("postCount").textContent = profile.postCount || 0;

    document.getElementById("followerCount").textContent =
      profile.followerCount || 0;

    document.getElementById("followingCount").textContent =
      profile.followingCount || 0;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// =========================
// LOGOUT
// =========================

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  token = null;
  currentUser = null;

  document.getElementById("homeSection").classList.add("hidden");

  document.getElementById("profileSection").classList.add("hidden");

  showLogin();

  alert("Logged out successfully");
}

// =========================
// SECURITY HELPER
// =========================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// =========================
// INITIAL PAGE
// =========================

document.addEventListener("DOMContentLoaded", () => {
  if (token && currentUser) {
    showSection("home");
  } else {
    showLogin();
  }
});
