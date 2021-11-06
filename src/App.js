import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import i1 from "./assets/images/1.png";
import mintImage from "./assets/images/mintImage.jpg";
import banner from "./assets/images/bitbotbanner.JPG"; //change
import './AppStyles.css'

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 300px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(250, 250, 0, 0.5);
  -moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 2px 3px 40px -2px rgba(250, 250, 0, 0.9);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 300px;
    height: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  const [selectedAmount, setSelectedAmount] = React.useState(1);

  const handleChange = (event) => {
    setSelectedAmount(event.target.value);
  };

  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("What Personality will your Bitbot have?");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Preparing your BitBot NFT...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        //gasLimit: "285000",
        to: "0x68cf439BA5D2897524091Ef81Cb0A3D1F56E5500", //change
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((.015 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("It seems the transaction was cancelled.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Woohoo! You just received your BitBot! Visit Opensea.io to view your randomly generated NFT!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 12 }}>
        <div className='header-text'> The BitBot Society Mint
        </div>
        
        <s.SpacerMedium />
        <img className="banner-img" src={banner} />
        <ResponsiveWrapper flex={1} style={{ padding: 12 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
          <StyledImg alt={'example'} src={mintImage} />
            <s.SpacerMedium />
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}
            >
              {data.totalSupply}/10000
            </s.TextTitle>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#000000", padding: 12 }}
          >
            {Number(data.totalSupply) == 10000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still buy and trade BitBot NFTs on{" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/the-bee-collaborative"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  1 BitBot NFT costs .015 ETH
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  -excluding gas fee-
                </s.TextDescription>
                <s.SpacerLarge />
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" }}>
                    
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== '' ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: 'center' }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                 <>
                  <div className="mui-select">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Amount</InputLabel>
                      <Select 
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedAmount}
                        label="Amount"
                        onChange={handleChange}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                  <s.Container ai={'center'} jc={'center'} fd={'row'}>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault()
                        claimNFTs(selectedAmount)
                        getData()
                      }}
                    >
                      {claimingNft ? 'Busy...' : `Buy ${selectedAmount} NFT`}
                    </StyledButton>
                  </s.Container>
                    
                    </>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={'center'} ai={'center'} style={{ width: '70%' }}>
          <s.TextDescription style={{ textAlign: 'center', fontSize: 18 }}>
            Thank you! Welcome to BitBot Society!
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription style={{ textAlign: 'center', fontSize: 14 }}>
            BitBot Rewarded #BitBotSociety <p />
            *.*.*Launching November 6th.*.*
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  )
}

export default App;