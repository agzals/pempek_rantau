import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl text-center">
        <Image src="/temporary/banner_pempek.png" alt="Company Image" width={500} height={200} className="mx-auto mb-4" />
        <p className="text-gray-700 mb-4">
          Halo Pecinta Kuliner! Pempek Rantau adalah usaha rumahan yang didirikan pada tahun 2021, berlokasi di Kecamatan Sawangan, Kota Depok. Kami berkomitmen untuk menyajikan pempek dengan cita rasa autentik Palembang yang menggunakan
          bahan-bahan pilihan berkualitas tinggi. Dengan mengutamakan kepuasan pelanggan, Pempek Rantau berusaha menjadi pilihan utama bagi pecinta kuliner pempek di Indonesia.
        </p>

        <h2 className="text-xl font-bold mb-2">Cara Pemesanan</h2>
        <ol className="text-gray-700 text-left list-decimal list-inside">
          <li>Melakukan Sign in dengan akun Google.</li>
          <li>Menuju ke halaman menu.</li>
          <li>Klik add to cart untuk menambahkan produk kedalam cart.</li>
          <li>Menuju ke halaman cart.</li>
          <li>Melakukan pembayaran.</li>
        </ol>

        <h2 className="text-xl font-bold mb-2 mt-2">Status Pemesanan</h2>
        <ol className="text-gray-700 text-left list-decimal list-inside">
          <li>Belum Bayar : Lakukan Pembayaran Segera.</li>
          <li>Diproses : Status Diproses jika pembayaran telah dikonfirmasi admin (10-20 menit). </li>
          <li>Dikirim : Status Dikirim jika produk telah dikirim melalui jasa pengiriman.</li>
          <li>Diterima Pembeli: Status Diterima Pembeli jika pembeli sudah mengklik pesanan diterima.</li>
        </ol>
      </div>
    </div>
  );
};

export default AboutPage;
