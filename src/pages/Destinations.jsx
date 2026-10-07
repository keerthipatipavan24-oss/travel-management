import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import "./Destinations.css";

// initial destination data
const initialDestinations = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    category: "Beach",
    duration: "4 Days / 3 Nights",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hfGVufDB8fDB8fHww",
    description: "Beautiful beaches and relaxing coastal experiences.",
  },
  {
    id: 2,
    name: "Kerala",
    country: "India",
    category: "Nature",
    duration: "5 Days / 4 Nights",
    price: 15000,
    image:
      "https://plus.unsplash.com/premium_photo-1697729600773-5b039ef17f3b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8a2VyYWxhfGVufDB8fDB8fHww",
    description: "Explore beautiful backwaters and natural landscapes.",
  },
  {
    id: 3,
    name: "Manali",
    country: "India",
    category: "Mountain",
    duration: "5 Days / 4 Nights",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww",
    description: "A scenic mountain destination surrounded by nature.",
  },
  {
    id: 4,
    name: "Dubai",
    country: "UAE",
    category: "City",
    duration: "5 Days / 4 Nights",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D",
    description: "Experience modern attractions, luxury and city life.",
  },
  {
    id: 5,
    name: "Bali",
    country: "Indonesia",
    category: "Beach",
    duration: "6 Days / 5 Nights",
    price: 35000,
    image:
      "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Tropical beaches, culture and peaceful island experiences.",
  },
  {
    id: 6,
    name: "Singapore",
    country: "Singapore",
    category: "City",
    duration: "5 Days / 4 Nights",
    price: 40000,
    image:
      "https://plus.unsplash.com/premium_photo-1697729420937-0ecb0ddb6e85?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2luZ2Fwb3JlfGVufDB8fDB8fHww",
    description: "A modern city destination with attractions and culture.",
  },
];

export default function Destinations() {
  // states

  const [destinations, setDestinations] = useState(() => {
    const savedDestinations = localStorage.getItem("destinations");

    return savedDestinations
      ? JSON.parse(savedDestinations)
      : initialDestinations;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const destinationsPerPage = 6;

  const [selectedDestination, setSelectedDestination] = useState(null);

  const [editDestination, setEditDestination] = useState(null);

  const [deleteDestination, setDeleteDestination] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState(null);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    category: "",
    duration: "",
    price: "",
    image: "",
    description: "",
  });

  // local storage

  useEffect(() => {
    localStorage.setItem("destinations", JSON.stringify(destinations));
  }, [destinations]);

  // search, filter

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || destination.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // sorting

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "name-az") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "name-za") {
      return b.name.localeCompare(a.name);
    }

    if (sortBy === "price-low") {
      return a.price - b.price;
    }

    if (sortBy === "price-high") {
      return b.price - a.price;
    }

    return 0;
  });

  // pagination

  const totalPages = Math.ceil(
    sortedDestinations.length / destinationsPerPage
  );

  const startIndex = (currentPage - 1) * destinationsPerPage;

  const currentDestinations = sortedDestinations.slice(
    startIndex,
    startIndex + destinationsPerPage
  );

  // reset page when search,
  // filter or sorting changes

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortBy]);

  // toast

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  // form input

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // add / edit destination

  const handleAddDestination = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Destination name is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // edit existing destination

    if (editDestination) {
      const updatedDestinations = destinations.map((destination) =>
        destination.id === editDestination.id
          ? {
              ...destination,
              name: formData.name,
              country: formData.country,
              category: formData.category,
              duration: formData.duration,
              price: Number(formData.price),
              image: formData.image,
              description: formData.description,
            }
          : destination
      );

      setDestinations(updatedDestinations);

      setToast({
        message: "Destination updated successfully",
        type: "success",
      });

      setEditDestination(null);
    }

    // add new destination

    else {
      const newDestination = {
        id:
          destinations.length > 0
            ? Math.max(
                ...destinations.map((destination) => destination.id)
              ) + 1
            : 1,

        name: formData.name,
        country: formData.country,
        category: formData.category,
        duration: formData.duration,
        price: Number(formData.price),
        image: formData.image,
        description: formData.description,
      };

      setDestinations([...destinations, newDestination]);

      setToast({
        message: "Destination added successfully",
        type: "success",
      });
    }

    // reset form

    setFormData({
      name: "",
      country: "",
      category: "",
      duration: "",
      price: "",
      image: "",
      description: "",
    });

    setErrors({});

    setShowModal(false);
  };

  // delete destination

  const handleDeleteDestination = () => {
    const updatedDestinations = destinations.filter(
      (destination) => destination.id !== deleteDestination.id
    );

    setDestinations(updatedDestinations);

    setToast({
      message: "Destination deleted successfully",
      type: "success",
    });

    setDeleteDestination(null);
  };

  // add button

  const handleAddButtonClick = () => {
    setEditDestination(null);

    setFormData({
      name: "",
      country: "",
      category: "",
      duration: "",
      price: "",
      image: "",
      description: "",
    });

    setErrors({});

    setShowModal(true);
  };

  // edit button

  const handleEditClick = (destination) => {
    setEditDestination(destination);

    setFormData({
      name: destination.name,
      country: destination.country,
      category: destination.category,
      duration: destination.duration,
      price: destination.price,
      image: destination.image,
      description: destination.description,
    });

    setErrors({});

    setShowModal(true);
  };

  // clear filters

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setSortBy("default");
  };

  // return

  if (loading) {
    return (
      <main className="destinations-page">
        <div className="destinations-loading">
          <p>Loading destinations...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="destinations-page">
      {/* toast */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* page header */}

      <div className="destinations-header">
        <div className="destinations-header-content">
          <div>
            <h1>Destinations</h1>

            <p>Explore and manage available travel destinations.</p>
          </div>

          <button
            className="add-destination-btn"
            onClick={handleAddButtonClick}
          >
            Add Destination
          </button>
        </div>
      </div>

      {/* add / edit modal */}

      {showModal && (
        <div className="destination-modal-overlay">
          <div className="destination-modal">
            <div className="destination-modal-header">
              <h2>
                {editDestination ? "Edit Destination" : "Add Destination"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditDestination(null);
                  setErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form className="destination-form" onSubmit={handleAddDestination}>
              {/* name */}

              <div className="form-group">
                <label>Destination Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter destination name"
                />

                {errors.name && (
                  <small className="form-error">{errors.name}</small>
                )}
              </div>

              {/* country */}

              <div className="form-group">
                <label>Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />

                {errors.country && (
                  <small className="form-error">{errors.country}</small>
                )}
              </div>

              {/* category */}

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>

                  <option value="Beach">Beach</option>

                  <option value="Nature">Nature</option>

                  <option value="Mountain">Mountain</option>

                  <option value="City">City</option>
                </select>

                {errors.category && (
                  <small className="form-error">{errors.category}</small>
                )}
              </div>

              {/* duration */}

              <div className="form-group">
                <label>Duration</label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Example: 4 Days / 3 Nights"
                />

                {errors.duration && (
                  <small className="form-error">{errors.duration}</small>
                )}
              </div>

              {/* price */}

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="1"
                />

                {errors.price && (
                  <small className="form-error">{errors.price}</small>
                )}
              </div>

              {/* image */}

              <div className="form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />

                {errors.image && (
                  <small className="form-error">{errors.image}</small>
                )}
              </div>

              {/* description */}

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter destination description"
                  rows="4"
                />

                {errors.description && (
                  <small className="form-error">{errors.description}</small>
                )}
              </div>

              {/* form actions */}

              <div className="destination-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditDestination(null);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-destination-btn">
                  {editDestination ? "Save Changes" : "Add Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* view modal */}

      {selectedDestination && (
        <div className="destination-modal-overlay">
          <div className="destination-modal">
            <div className="destination-modal-header">
              <h2>Destination Details</h2>

              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
              >
                ×
              </button>
            </div>

            <div className="destination-view">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
              />

              <h3>{selectedDestination.name}</h3>

              <p>
                <strong>Country:</strong> {selectedDestination.country}
              </p>

              <p>
                <strong>Category:</strong> {selectedDestination.category}
              </p>

              <p>
                <strong>Duration:</strong> {selectedDestination.duration}
              </p>

              <p>
                <strong>Price:</strong> ₹
                {Number(selectedDestination.price).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedDestination.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* search, filgter & sort */}

      <div className="destination-filters">
        <input
          type="text"
          placeholder="Search destination..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="All">All Categories</option>

          <option value="Beach">Beach</option>

          <option value="Nature">Nature</option>

          <option value="Mountain">Mountain</option>

          <option value="City">City</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="default">Sort By</option>

          <option value="name-az">Name: A to Z</option>

          <option value="name-za">Name: Z to A</option>

          <option value="price-low">Price: Low to High</option>

          <option value="price-high">Price: High to Low</option>
        </select>

        {/* clear button */}

        {(searchTerm || categoryFilter !== "All" || sortBy !== "default") && (
          <button className="clear-search-btn" onClick={handleClearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* destination list */}

      <section className="destination-list">
        <div className="section-header">
          <h2>Popular Destinations</h2>

          <p>Explore our available travel destinations.</p>
        </div>

        <div className="destination-grid">
          {currentDestinations.length > 0 ? (
            currentDestinations.map((destination) => (
              <div className="destination-card" key={destination.id}>
                {/* image */}

                <div className="destination-image">
                  <img src={destination.image} alt={destination.name} />
                </div>

                {/* content */}

                <div className="destination-content">
                  <h3>{destination.name}</h3>

                  <p>{destination.country}</p>

                  <p>{destination.duration}</p>

                  <p>₹{Number(destination.price).toLocaleString("en-IN")}</p>

                  <span>{destination.category}</span>

                  {/* actions */}

                  <div className="destination-actions">
                    <button onClick={() => setSelectedDestination(destination)}>
                      View
                    </button>

                    <button onClick={() => handleEditClick(destination)}>
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteDestination(destination)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="destination-empty">
              <h3>No destinations found</h3>

              <p>Try changing your search or category filter.</p>
            </div>
          )}
        </div>

        {/* pagination */}

        <div className="destination-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* delete confirmation */}

      {deleteDestination && (
        <div className="destination-modal-overlay">
          <div className="destination-modal">
            <div className="destination-modal-header">
              <h2>Delete Destination</h2>

              <button
                type="button"
                onClick={() => setDeleteDestination(null)}
              >
                ×
              </button>
            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteDestination.name}</strong>?
            </p>

            <div className="destination-form-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteDestination(null)}
              >
                Cancel
              </button>

              <button
                className="save-destination-btn"
                onClick={handleDeleteDestination}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* destination summary */}

      <section className="destination-summary">
        <div className="section-header">
          <h2>Destination Summary</h2>

          <p>Overview of available travel destinations.</p>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Destinations</h3>

            <p>{destinations.length}</p>
          </div>

          <div className="summary-card">
            <h3>Beach Destinations</h3>

            <p>
              {
                destinations.filter(
                  (destination) => destination.category === "Beach"
                ).length
              }
            </p>
          </div>

          <div className="summary-card">
            <h3>City Destinations</h3>

            <p>
              {
                destinations.filter(
                  (destination) => destination.category === "City"
                ).length
              }
            </p>
          </div>
        </div>
      </section>
    </main>
  );
} 