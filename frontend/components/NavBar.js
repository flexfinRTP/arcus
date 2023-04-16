import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
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

  return (
    <>
      <div>
        <Box gap={2}  as="b">
          <Stack
            direction={"row"}
            spacing={24}
            py={2}
            px={16}
            display="flex"
            alignItems="center"
          >
                          <Text fontSize="4xl" pr={24}>[Arcus]</Text>
            <Flex h={12} alignItems={"center"} justifyContent={"space-between"}>
              {/* <Link
					href="/"
				  >
					<Image src={} alt="logo" width={60} height={60} />
				  </Link> */}
            </Flex>
            <Menu>
              <Link href="/">Home</Link>
              <Link href="/bridge">Bridge</Link>
              <Link href="/btcreserve">BTC Reserve</Link>
              <Link href="/btcmarket">Invest</Link>
            </Menu>

            <Box pr={24} px={24}>
              <div>
                {/* ConnectWallet file: `../components/ConnectWallet.js` */}
                <ConnectWallet />
                {/* ContractCallVote file: `../components/ContractCallVote.js` */}
              </div>
            </Box>
          </Stack>
        </Box>
      </div>
    </>
  );
}
