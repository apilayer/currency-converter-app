import React, { useEffect, useRef, useState } from "react";

const LineGraph = ({ data }) => {
  const canvasRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 400;

    // Define margins and graph area
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    // Get data values
    const labels = data.map((item) => item.date);
    const prices = data.map((item) => item.price);

    // Calculate the scaling factor
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // Helper function to get x and y positions
    const getX = (index) => margin + (index / (prices.length - 1)) * width;
    const getY = (price) =>
      margin + height - ((price - minPrice) / (maxPrice - minPrice)) * height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color for dark theme
    ctx.fillStyle = "#1a202c"; // Dark gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = "#E2E8F0"; // Light color for axis lines (contrast with dark background)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Plot the line graph
    ctx.strokeStyle = "rgba(75, 192, 192, 1)"; // Light teal color for the graph line
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(prices[0]));

    prices.forEach((price, index) => {
      ctx.lineTo(getX(index), getY(price));
    });
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = "rgba(75, 192, 192, 1)"; // Light teal color for points
    prices.forEach((price, index) => {
      ctx.beginPath();
      ctx.arc(getX(index), getY(price), 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add labels for x-axis (dates)
    // Helper function to format date as MM/YY
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (1-based)
      const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
      return `${month}/${year}`;
    };

    // Add labels for x-axis (formatted dates)
    ctx.fillStyle = "#E2E8F0"; // Light color for labels
    ctx.font = "12px Arial";
    labels.forEach((label, index) => {
      const x = getX(index);
      const formattedDate = formatDate(label);
      ctx.fillText(formattedDate, x - 20, canvas.height - margin + 20);
    });

    // Add labels for y-axis (prices)
    ctx.fillText(`Min: ${minPrice}`, margin - 40, canvas.height - margin);
    ctx.fillText(`Max: ${maxPrice}`, margin - 40, margin);

    // Mouse move event to handle hover effect
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Check if the mouse is close to any data point
      prices.forEach((price, index) => {
        const x = getX(index);
        const y = getY(price);
        const radius = 6;

        // Check if the mouse is within the point's radius
        if (
          mouseX >= x - radius &&
          mouseX <= x + radius &&
          mouseY >= y - radius &&
          mouseY <= y + radius
        ) {
          setHoverData({ x, y, price });
        } else {
          setHoverData(null);
        }
      });
    };

    // Mouse out event to hide tooltip when the mouse leaves the canvas
    const handleMouseOut = () => {
      setHoverData(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseout", handleMouseOut);

    // Cleanup event listeners
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseout", handleMouseOut);
    };
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
        }}
      />
      {hoverData && (
        <div
          style={{
            position: "absolute",
            top: hoverData.y - 30,
            left: hoverData.x + 10,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltip
            color: "#fff",
            padding: "5px",
            borderRadius: "4px",
            pointerEvents: "none",
            fontSize: "14px", // Slightly smaller font for tooltip
          }}
        >
          Price: {hoverData.price}
        </div>
      )}
    </div>
  );
};

export default LineGraph;
