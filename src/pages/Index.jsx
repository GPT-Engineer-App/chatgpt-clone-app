import { useState } from "react";
import { Container, VStack, Input, Button, Text, Box } from "@chakra-ui/react";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          prompt: input,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.9,
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.choices[0].text.trim() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { sender: "bot", text: "Sorry, I couldn't process your request." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" overflowY="auto" border="1px solid #ccc" borderRadius="md" p={4}>
          {messages.map((msg, index) => (
            <Text key={index} alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"} bg={msg.sender === "user" ? "blue.100" : "gray.100"} p={2} borderRadius="md" mb={2}>
              {msg.text}
            </Text>
          ))}
        </Box>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} colorScheme="blue">Send</Button>
      </VStack>
    </Container>
  );
};

export default Index;