import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-pink-600 flex flex-col items-center justify-center text-white px-4">
      <div className="bg-white/15 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center max-w-3xl border border-white/20">
        <h1 className="text-5xl font-bold mb-4">
          🚀 Team Task Manager
        </h1>

        <p className="text-lg mb-8 text-white/90">
          Manage projects, assign tasks, track progress and collaborate with
          your team in one powerful dashboard.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Success");

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to manage your tasks
        </p>

        <input
          className="w-full border border-gray-300 p-3 rounded-xl mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-3 rounded-xl mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/register`, {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Start managing your team today
        </p>

        <input
          className="w-full border border-gray-300 p-3 rounded-xl mb-4"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-3 rounded-xl mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-3 rounded-xl mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API}/tasks`,
        getAuthHeaders()
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createTask = async () => {
    if (!title) return;

    try {
      await axios.post(
        `${API}/tasks`,
        {
          title,
        },
        getAuthHeaders()
      );

      setTitle("");

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const completedTasks = useMemo(() => {
    return tasks.filter(
      (task) => task.status === "Completed"
    ).length;
  }, [tasks]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <aside className="w-72 min-h-screen bg-slate-900 text-white p-6 hidden md:block">
          <h2 className="text-3xl font-black mb-8">
            ⚡ TaskFlow
          </h2>

          <div className="space-y-3">
            <div className="bg-blue-600 p-4 rounded-2xl">
              📊 Dashboard
            </div>

            <div className="hover:bg-slate-800 p-4 rounded-2xl cursor-pointer">
              ✅ Tasks
            </div>

            <div className="hover:bg-slate-800 p-4 rounded-2xl cursor-pointer">
              👥 Team
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-10 w-full bg-red-500 py-3 rounded-xl font-bold"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h1 className="text-4xl font-black text-slate-800">
              Welcome, {user?.name} 👋
            </h1>

            <p className="text-slate-500 mt-2">
              Role: {user?.role}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold">
                Total Tasks
              </h3>

              <p className="text-5xl font-black mt-3">
                {tasks.length}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold">
                Completed
              </h3>

              <p className="text-5xl font-black mt-3">
                {completedTasks}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold">
                Pending
              </h3>

              <p className="text-5xl font-black mt-3">
                {tasks.length - completedTasks}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-black mb-4">
              ➕ Create Task
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="flex-1 border border-slate-300 p-4 rounded-2xl"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                onClick={createTask}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-black mb-4">
              📋 Task List
            </h2>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold">
                      {task.title}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      {task.status}
                    </p>
                  </div>

                  <button
                    className="mt-3 md:mt-0 bg-green-600 text-white px-5 py-2 rounded-xl"
                  >
                    Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;