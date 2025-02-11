import { GrClose } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { setIsModal } from "../../../slice/appSlice";
// import { setKunjungan } from "../../firebase/service";

export default function ModalKunjungan(data: any) {
  const dispatch = useDispatch();
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(formattedDate),data;
    // setKunjungan("kunjungan" + formattedDate, {
    //   ...data,
    //   deskripsi_kunjungan: e.target.deskripsi_kunjungan.value,
    // }).then((res: any) => {
    //   console.log(res);
    // });
  }
  return (
    <main className="bg-black/50 w-full min-h-full fixed z-10 justify-center items-center flex">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-4 w-3/4 h-3/4 tablet:w-1/2 tablet:h-1/3 z-10 flex flex-col gap-2"
      >
        <GrClose
          onClick={() => {
            dispatch(setIsModal());
          }}
          className="self-end text-lg tablet:text-2xl cursor-pointer"
        ></GrClose>
        <h1 className="text-center font-bold text-lg tablet:text-2xl">
          Deskripsi Kunjungan
        </h1>
        <textarea
          name="deskripsi_kunjungan"
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm tablet:text-lg bg-gray-100 rounded-lg"
          autoFocus
          placeholder="Tuliskan deskripsi kunjungan mu..."
        ></textarea>
        <button
          type="submit"
          className="bg-orange-500 text-black font-semibold rounded-lg py-1"
        >
          KIRIM
        </button>
      </form>
    </main>
  );
}
