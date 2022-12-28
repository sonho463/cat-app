import type { GetServerSideProps, NextPage } from "next";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexPageProps {
  initialCatImageUrl: string;
}
const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  // console.log(result[0])
  return result[0];
};

export const Home: NextPage<IndexPageProps> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    console.log(catImage);
    setCatImageUrl(catImage.url);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>猫画像アプリ</h1>
      <p>今日の猫さんボタンを押すといろいろな猫と出会えます。</p>

      {isLoading ? (
        <Loader active style={{height: "500px"}} size="huge" inline="centered"/>
      ) : (
        <img
          style={{ marginTop: 18 }}
          width="auto"
          height={500}
          src={catImageUrl}
          alt=""
        />
      )}

      <button
        style={{
          marginTop: 18,
        }}
        onClick={handleClick}
      >
        今日の猫さん
      </button>
    </div>
  );
};

// SSRで初期のイメージURLを設定
export const getServerSideProps: GetServerSideProps<
  IndexPageProps
> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default Home;
