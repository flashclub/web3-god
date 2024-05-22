"use client";
import { useState, useEffect } from "react";
import { Input, Button } from "antd";
const { Search } = Input;
export default function Home() {
  const { TextArea } = Input;
  const [input, setInput] = useState("");
  const [tx, setTx] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(false);
  const searchData = async () => {
    setLoading(true);
    console.log("input: ", input);
    const { data } = await fetch(`/api/detect?input=${input}`, {
      method: "GET",
    }).then((response) => response.json());
    console.log("res--", data);
    const { isContract, tx = null } = data;
    console.log("tx: ", tx);
    if (tx) {
      setTx(tx);
      setShowInfo(false);
    } else {
      setTx(null);
      setShowInfo(true);
      setContract(isContract);
    }
    setLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      {/* <Input></Input> */}
      {/* <Button onClick={searchData}>搜索</Button> */}
      <Search
        enterButton="Search"
        placeholder="please enter address, contract or hash"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setTx(null);
          setShowInfo(false);
        }}
        onSearch={searchData}
        size="large"
        loading={loading}
      />
      {tx && (
        <div>
          <h3 className="text-lg">{input} is a hash</h3>
          <div className="break-all">
            <TextArea rows={30} value={tx}></TextArea>
          </div>
        </div>
      )}
      {showInfo && (
        <div>
          <h3 className="text-lg">
            {input} is {contract ? "contract" : "address"}
          </h3>
        </div>
      )}
    </main>
  );
}
