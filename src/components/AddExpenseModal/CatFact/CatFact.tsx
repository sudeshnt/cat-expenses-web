import { Box, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

type CatFactProps = {
  isOpen: boolean;
};

export const CatFact = ({ isOpen }: CatFactProps): JSX.Element => {
  const [fact, setFact] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("https://catfact.ninja/fact", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setFact(responseJson.fact);
        });
    }
  }, [isOpen]);

  return (
    <Stack>
      <Text as="samp" fontSize="md" color="yellow.600" my={2}>
        Random cat Fact:
      </Text>
      {fact ? (
        <Box>
          <TypeAnimation
            sequence={[fact]}
            wrapper="span"
            speed={55}
            style={{
              fontSize: "15px",
              display: "inline-block",
              fontStyle: "italic",
            }}
          />
        </Box>
      ) : (
        <>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </>
      )}
    </Stack>
  );
};
