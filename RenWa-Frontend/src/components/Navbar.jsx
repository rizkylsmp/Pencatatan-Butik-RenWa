import React from "react";
import { UserCircle } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex gap-2 border-b-2 pb-3 pt-3 border-color-1 text-color-5 items-center justify-end">
      <UserCircle size={40} weight="fill" />
      <strong className="font-semibold pr-5 md:max-w-72 max-w-36 overflow-hidden whitespace-nowrap text-ellipsis">
        {user && user.nama}
      </strong>
    </div>
  );
};

export default Navbar;
