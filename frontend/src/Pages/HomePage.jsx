import { useEffect, useState } from "react";
import Card from "../Components/ProductCard/Card";
import axios from "axios";


function HomePage() {
  const [data, setdata] = useState([]);
  const fetchProduct = async () => {
    const response = await axios.get(
      "http://localhost:8000/product/get-products"
    );
    setdata(response.data.data);
    console.log(response);
  };

  useEffect(() => {
    console.log("clicked");
    const callhandle = async () => {
      await fetchProduct();
    };
    callhandle();
  }, []);

  const handleDelete = async (id) => {
    console.log("id", id);
    const data = await axios.delete(`http://localhost:8000/product/${id}`);
    setdata(data.data.data);
  };
  console.log(data);
  return (
    <div>
     

      <div className="grid grid-cols-3">
        {data?.map((ele, index) => {
          return (
            <div
              key={index}
              style={{ margin: "auto" }}
              className="border border-white"
            >
              {/* <Link to={`/product-details/${ele._id}`}> */}
              <Card
                title={ele.title}
                image={ele.images[0] ? ele.images[0] : "Product Image missing"}
                Index={index}
                description={ele.description}
                originalPrice={ele.originalPrice}
                discountedPrice={ele.discountedPrice}
                rating={ele.rating}
                id={ele._id}
                handleDelete={handleDelete}
              />
            
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
