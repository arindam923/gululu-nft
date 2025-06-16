import * as React from "react";

interface BurnConfirmationEmailProps {
  walletAddress: string;
  nftDetails: {
    contractAddress: string;
    tokenId: string;
    name?: string;
    media?: string;
  };
  pointsReceived: number;
}

export const BurnConfirmationEmail: React.FC<BurnConfirmationEmailProps> = ({
  walletAddress,
  nftDetails,
  pointsReceived,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fde0b9",
        borderRadius: "10px",
        color: "#000",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <img
          src="https://gululu-bucket.s3.ap-south-1.amazonaws.com/LOGOy2+1.png"
          alt="GULULU Logo"
          style={{
            width: "220px",
            height: "auto",
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          NFT Burn Confirmation
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "15px",
            fontWeight: "500",
          }}
        >
          Congratulations! You have successfully swapped your NFT and received
          points.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {nftDetails.media && (
            <img
              src={nftDetails.media}
              alt={nftDetails.name || "NFT"}
              style={{
                width: "200px",
                height: "auto",
                borderRadius: "10px",
                border: "1px solid #ddd",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
        </div>

        <div
          style={{
            backgroundColor: "#f8f8f8",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            Swap Details
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>
                  NFT Name:
                </td>
                <td style={{ padding: "8px 0" }}>{nftDetails.name || "N/A"}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>
                  Token ID:
                </td>
                <td style={{ padding: "8px 0" }}>{nftDetails.tokenId}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>
                  Contract:
                </td>
                <td
                  style={{ padding: "8px 0" }}
                >{`${nftDetails.contractAddress.substring(0, 6)}...${nftDetails.contractAddress.substring(nftDetails.contractAddress.length - 4)}`}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>
                  Wallet:
                </td>
                <td
                  style={{ padding: "8px 0" }}
                >{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "bold" }}>
                  Points Received:
                </td>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    color: "#FF6B00",
                    fontSize: "18px",
                  }}
                >
                  {pointsReceived}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <a
            href="https://gululu.io/swap"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#FF6B00",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              border: "1px solid #FF6B00",
            }}
          >
            Swap More NFTs
          </a>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#000",
          marginTop: "20px",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          paddingTop: "15px",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
          © 2025 GULULU
        </p>
        <p style={{ fontSize: "12px", fontWeight: "500" }}>
          All Rights Reserved |{" "}
          <a
            href="https://gululu.io/terms"
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Terms and Conditions
          </a>
          {" | "}
          <a
            href="https://gululu.io/privacy"
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
