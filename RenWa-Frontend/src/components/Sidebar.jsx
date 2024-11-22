import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/LOGO.jpeg";
import {
  House,
  Users,
  ChartPieSlice,
  PlusCircle,
  MinusCircle,
  ArrowFatLinesDown,
  ArrowFatLinesUp,
  List,
  SignOut,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import { useMediaQuery } from "@react-hook/media-query";

const Sidebar = ({ open, setOpen }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const links = [
    {
      icon: <House size={20} weight="fill" />,
      title: "Dashboard",
      to: "/dashboard",
    },
    {
      icon: <ChartPieSlice size={20} weight="fill" />,
      title: "Data Penjualan",
      to: "/data-penjualan",
    },
    {
      icon: <PlusCircle size={20} weight="fill" />,
      title: "Terima Barang",
      to: "/terima-barang",
    },
    {
      icon: <MinusCircle size={20} weight="fill" />,
      title: "Kembali Barang",
      to: "/kembali-barang",
    },
  ];

  const adminLinks = [
    {
      icon: <Users size={20} weight="fill" />,
      title: "Data User",
      to: "/data-user",
    },
    {
      icon: <ArrowFatLinesDown size={20} weight="fill" />,
      title: "Barang Masuk",
      to: "/barang-masuk",
    },
    {
      icon: <ArrowFatLinesUp size={20} weight="fill" />,
      title: "Barang Keluar",
      to: "/barang-keluar",
    },
  ];

  const renderLinks = (links) =>
    links.map((link, index) => (
      <Link
        key={index}
        to={link.to}
        className={`flex gap-3 items-center p-2 ml-5 text-color-4 hover:bg-color-3 hover:text-color-5 rounded-l-2xl ${
          location.pathname === link.to ? "bg-color-3 text-color-5" : ""
        }`}
      >
        <div className={`duration-300 ${!open && "items-center"} duration-300`}>
          {link.icon}
        </div>
        <div
          className={`${
            !open && "absolute scale-0 transition-opacity duration-100"
          }`}
        >
          {link.title}
        </div>
      </Link>
    ));

  return (
    <div>
      {/* MENU BUTTON */}
      <List
        size={32}
        weight="bold"
        className={`fixed inset-0 z-40 md:z-20 left-7 top-5 cursor-pointer ${
          open
            ? "text-color-3 md:text-color-5 md:left-64 "
            : "text-color-5 md:left-24 md:bg-opacity-0 bg-color-3 rounded bg-opacity-60"
        } duration-300`}
        onClick={() => setOpen(!open)}
      />
      <div
        className={`fixed inset-0 z-30 md:z-20 bg-color-5 min-h-lvh overflow-y-auto ${
          open
            ? "block md:min-w-60"
            : "md:min-w-20 transform -translate-x-full md:-translate-x-0"
        }  md:relative duration-150 md:duration-300`}
      >
        {/* LOGO */}
        <Link
          to={"/dashboard"}
          className={`flex gap-2 items-center justify-center md:justify-start px-6 pt-4 cursor-pointer ${
            !open && "items-center justify-center pb-4"
          }`}
        >
          <img
            src={Logo}
            alt="Logo"
            className={`w-12 duration-300 ${!open && "rotate-[360deg] w-8"}`}
          />
          <div
            className={`font-extrabold text-[22px] text-color-3 ${
              !open && "absolute opacity-0 scale-0"
            }`}
          >
            RenWa
          </div>
        </Link>

        <div className="flex flex-col">
          <label
            className={`${open ? "text-color-3 divider divider-primary" : ""}`}
          >
            {!open ? <hr className="border-white mb-5" /> : "General"}
          </label>
          <div className="flex flex-col gap-4">{renderLinks(links)}</div>
          {user && user.role === "admin" && (
            <div className="flex flex-col mt-3 text-color-4">
              <label
                className={`${
                  open ? "text-color-3 divider divider-primary" : ""
                }`}
              >
                {!open ? <hr className="border-white my-5" /> : "Admin"}
              </label>
              <div className="flex flex-col gap-4">
                {renderLinks(adminLinks)}
              </div>
            </div>
          )}
          <div className="flex flex-col mt-3">
            <label
              className={`${
                open ? " text-color-3 divider divider-primary" : ""
              }`}
            >
              {!open ? <hr className="border-white my-5" /> : "Setting"}
            </label>
            <button onClick={logout}>
              <div className="flex items-center gap-3 p-2 ml-5 mb-5 text-color-4 hover:bg-color-3 hover:text-black rounded-l-2xl">
                <SignOut
                  size={20}
                  weight="fill"
                  className={` ${!open && "self-center"}`}
                />
                <div className={`${!open && "absolute scale-0"}`}>Keluar</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
