// "use client";

// import { useEffect } from "react";

// const PayPage = ({ params }: { params: { id: string } }) => {
//   const { id } = params;

//   useEffect(() => {
//     const makeRequest = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/create-intent/${id}`, {
//           method: "POST",
//         });
//         const data = await res.json();
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     makeRequest();
//   }, [id]);

//   return <div></div>;
// };

// export default PayPage;
