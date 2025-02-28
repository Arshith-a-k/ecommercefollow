import { useNavigate } from "react-router-dom";

const AddressList = ({ addresses }) => {
  console.log("addresses");
  const navigate = useNavigate();
  if (!addresses || addresses.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "16px", color: "#666" }}>
        No addresses found
      </div>
    );
  }
  const handleClickAddress = (index) => {
    const SingleAddress = addresses[index];
    localStorage.setItem("address", JSON.stringify(SingleAddress));
    navigate("/order-confirmation");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {addresses.map((address, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onClick={() => handleClickAddress(index)}
        >
          <div style={{ marginBottom: "8px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#1a202c",
                textTransform: "capitalize",
                marginBottom: "8px",
              }}
            >
              {address.addressType || "Address"} {index + 1}
            </h3>
            <div style={{ color: "#4a5568" }}>
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.city}
                {address.zipCode && `, ${address.zipCode}`}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
