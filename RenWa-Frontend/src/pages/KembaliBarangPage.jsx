import React, { useEffect } from "react";
import Layout from "../components/Layout";
import KembaliBarang from "../contents/KembaliBarang";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const KembaliBarangPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <KembaliBarang />
    </Layout>
  );
};

export default KembaliBarangPage;
