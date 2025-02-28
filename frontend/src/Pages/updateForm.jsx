import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function UpdateForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    discountedPrice: "",
    originalPrice: "",
    quantity: "",
    category: "",
  });
  const [errorInput, setInputError] = useState("");
  const [images, setImages] = useState(null);

  const handleImageUpload = (e) => {
    const imagesArray = Array.from(e.target.files);
    setImages(imagesArray);
  };

  const handleChange = (e) => {
    setInputError("");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      title,
      description,
      rating,
      discountedPrice,
      originalPrice,
      quantity,
      category,
    } = formData;
    if (
      title.length <= 0 ||
      description.length <= 0 ||
      discountedPrice <= 0 ||
      originalPrice <= 0 ||
      quantity <= 0 ||
      category.length <= 0
    ) {
      return setInputError("Please fill all the fields correctly.");
    }

    let formDataBody = new FormData();
    formDataBody.append("title", title);
    formDataBody.append("description", description);
    formDataBody.append("category", category);
    formDataBody.append("discountedPrice", discountedPrice);
    formDataBody.append("originalPrice", originalPrice);
    formDataBody.append("quantity", quantity);
    formDataBody.append("rating", rating);

    if (images) {
      images?.map((ele) => {
        formDataBody.append("files", ele);
      });
    } else {
      formDataBody.append("images", formData.images);
    }

    axios
      .put(
        `http://localhost:8080/product/update-products/${id}`,
        formDataBody,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Product updated successfully:", response);
      })
      .catch((error) => {
        console.log("Error updating product:", error);
      });
  };
  useEffect(() => {
    const getDataForId = async () => {
      const singleData = await axios.get(
        `http://localhost:8080/product/get-single/${id}`
      );
      setFormData(singleData.data.data);
      setImages(singleData.data.data.images);
    };
    getDataForId();
  }, [id]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Add New Product
        </h2>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Product title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="discountedPrice"
            className="block text-lg font-medium text-gray-700"
          >
            Discounted Price
          </label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            placeholder="Discounted Price"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="originalPrice"
            className="block text-lg font-medium text-gray-700"
          >
            Original Price
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="Original Price"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-lg font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter the Stock Quantity"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="images"
            className="block text-lg font-medium text-gray-700"
          >
            Upload Product Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter Category"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-lg font-medium text-gray-700"
          >
            Enter Rating of Product
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Rating of the Product"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorInput && (
          <p className="text-red-500 text-center mb-4">{errorInput}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateForm;
