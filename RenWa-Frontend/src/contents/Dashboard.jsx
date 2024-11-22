import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCartSimple,
  Users,
  ChartBar,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    jumlahTerjual: 0,
    jumlahProduk: 0,
    jumlahPengguna: 0,
    terjualHariIni: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/stats`
        );
        setStats(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-color-1 bg-opacity-50 flex justify-center items-center z-50 text-color-1">
        <div className="p-4 rounded-md">
          <span className="loading loading-dots loading-lg text-color-3"></span>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: <ChartBar weight="fill" />,
      label: "Terjual Hari ini",
      value: stats.terjualHariIni,
      to: "/data-penjualan",
    },
    {
      icon: <ShoppingCartSimple weight="fill" />,
      label: "Jumlah Terjual",
      value: stats.jumlahTerjual,
      to: "/data-penjualan",
    },
    {
      icon: <Users weight="fill" />,
      label: "Jumlah Pengguna",
      value: stats.jumlahPengguna,
      to: "/data-user",
    },
  ];

  return (
    <div className="p-6 h-fit bg-color-5 rounded shadow-xl md:text-base text-sm text-color-3">
      <div className="flex flex-col gap-5">
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="flex flex-col gap-5">
          {statItems.map((stat, index) => (
            <Link
              key={index}
              to={stat.to}
              className="flex flex-row gap-16 justify-center items-center p-10 border-2 border-color-4 hover:border-color-3 shadow-xl rounded-xl duration-500"
            >
              <div className="text-8xl">
                {stat.icon}
              </div>
              <div className="flex flex-col gap-2 text-center">
                <div className="text-5xl font-bold">
                  {stat.value}
                </div>
                <div className="font-semibold text-md">{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
