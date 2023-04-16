import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Container,
  HStack,
  Link,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import ConnectWallet from "../components/ConnectWallet";
import { useRouter } from "next/router";
import Arcus from "../public/Arcus_logo.png";

const Links = ["Home", "Lend/Borrow", "Team", "Docs"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <div>
        <Container gap={2} as="b" centerContent>
          <Stack
            direction={"row"}
            spacing={24}
            py={10}
            display="flex"
            alignItems="center"
          >
            {/* <Image
              src={Arcus}
              alt="logo"
              py={20}
              width={200}
              height={200}
              onClick={() => router.push("/")}
            /> */}
            <Menu>
              <Link fontSize="lg" href="/">
                Home
              </Link>
              <Link fontSize="lg" href="/bridge">
                Bridge
              </Link>
              <Link fontSize="lg" textAlign={"center"} href="/btcreserve">
                BTC Reserve
              </Link>
              <Link fontSize="lg" href="/btcmarket">
                Invest
              </Link>
            </Menu>

            <Box pr={24} px={24}>
              <div>
                {/* ConnectWallet file: `../components/ConnectWallet.js` */}
                <ConnectWallet />
                {/* ContractCallVote file: `../components/ContractCallVote.js` */}
              </div>
            </Box>
          </Stack>
        </Container>
      </div>
    </>
  );
}
