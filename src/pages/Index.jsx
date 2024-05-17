import React, { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Button, Box, List, ListItem } from "@chakra-ui/react";
import WebSocketInstance from "../utils/websocket";

const Index = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    WebSocketInstance.connect();
    WebSocketInstance.addCallbacks(setMessages, addMessage);

    return () => {
      WebSocketInstance.socketRef.close();
    };
  }, []);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    const messageObject = { from: "user", content: message };
    WebSocketInstance.newChatMessage(messageObject);
    setMessage("");
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Real-Time Messaging</Text>
        <Box width="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
          <List spacing={3}>
            {messages.map((msg, index) => (
              <ListItem key={index} p={2} borderWidth="1px" borderRadius="md">
                {msg.from}: {msg.content}
              </ListItem>
            ))}
          </List>
        </Box>
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <Button onClick={sendMessage} colorScheme="blue">
          Send
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;