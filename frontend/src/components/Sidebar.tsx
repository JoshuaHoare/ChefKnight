import React from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon,
  List,
  ListItem,
  Icon,
  Skeleton,
  Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaFolder, FaFileAlt } from 'react-icons/fa';

interface SidebarProps {
  folders: string[];
  content: Record<string, string[]>;
  selectedFolder: string | null;
  selectedFile: string | null;
  onSelectFolder: (folder: string) => void;
  onSelectFile: (folder: string, file: string) => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  content,
  selectedFolder,
  selectedFile,
  onSelectFolder,
  onSelectFile,
  loading
}) => {
  const navigate = useNavigate();
  
  const handleSelectFile = (folder: string, file: string) => {
    onSelectFile(folder, file);
    navigate(`/${folder}/${file}`);
  };

  if (loading) {
    return (
      <Box 
        w="280px" 
        h="full" 
        bg="white" 
        borderRight="1px" 
        borderColor="gray.200"
        p={4}
        overflowY="auto"
      >
        <Heading size="md" mb={4}>Encyclopedia</Heading>
        <VStack spacing={4} align="stretch">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} h="40px" />
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      w="280px" 
      h="full" 
      bg="white" 
      borderRight="1px" 
      borderColor="gray.200"
      p={4}
      overflowY="auto"
    >
      <Heading size="md" mb={4}>Encyclopedia</Heading>
      
      <Accordion allowMultiple defaultIndex={folders.map((_, i) => i)}>
        {folders.map((folder) => (
          <AccordionItem key={folder} border="none">
            <AccordionButton 
              px={2} 
              py={3}
              _hover={{ bg: 'gray.100' }}
              bg={selectedFolder === folder && !selectedFile ? 'gray.100' : 'transparent'}
              fontWeight={selectedFolder === folder ? 'semibold' : 'normal'}
              onClick={() => onSelectFolder(folder)}
            >
              <Flex flex="1" alignItems="center">
                <Icon as={FaFolder} color="yellow.500" mr={2} />
                <Text textTransform="capitalize">{folder}</Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <List spacing={1}>
                {content[folder] && content[folder].length > 0 ? (
                  content[folder].map((file) => (
                    <ListItem 
                      key={file}
                      px={4}
                      py={2}
                      cursor="pointer"
                      bg={selectedFolder === folder && selectedFile === file ? 'blue.50' : 'transparent'}
                      fontWeight={selectedFolder === folder && selectedFile === file ? 'medium' : 'normal'}
                      color={selectedFolder === folder && selectedFile === file ? 'blue.600' : 'inherit'}
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => handleSelectFile(folder, file)}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FaFileAlt} mr={2} size="sm" />
                      <Text>{file}</Text>
                    </ListItem>
                  ))
                ) : (
                  <ListItem px={4} py={2} color="gray.500" fontSize="sm">
                    No entries yet
                  </ListItem>
                )}
              </List>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default Sidebar;
