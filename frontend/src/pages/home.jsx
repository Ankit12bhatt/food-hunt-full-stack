import background from "../assets/home.jpg";
import Button from "react-bootstrap/Button";

export default function Home() {
  return (
    <>
      {/* section1 */}
      <div
        style={{
          width: "100%",
          height: "90vh",
          backgroundImage: `url(${background})`,
        }}
        className="container-fluid pt-5"
      >
        <div className="row d-flex flex-row-reverse pt-5">
          <div
            className="col-lg-5  d-flex flex-column pt-5 "
            style={{ height: "90vh" }}
          >
            <h1
              style={{ fontSize: "90px", fontWeight: "500", color: "#01696E" }}
            >
              LET'S START <br /> SAVING <br /> FOOD
            </h1>
            <div className="row mt-5">
              <div className="col-md-3">
                <Button
                  className="btn btn-light rounded-5 text-dark border-dark"
                  style={{ width: "100%" }}
                >
                  for Business
                </Button>
              </div>
              <div className="col-md-3">
                <Button
                  className="btn btn-light rounded-5 text-dark border-dark"
                  style={{ width: "100%" }}
                >
                  for Customers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
