import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Text,
  HStack,
  Badge,
  Tooltip,
  useToast,
  Skeleton,
} from '@chakra-ui/react';
import { FaGithub, FaSync, FaCloudUploadAlt } from 'react-icons/fa';
import { GitStatus } from '../types';
import { ApiService } from '../services/ApiService';

interface HeaderProps {
  gitStatus?: GitStatus;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ gitStatus, loading }) => {
  const toast = useToast();
  const [isPulling, setIsPulling] = React.useState(false);
  const [isPushing, setIsPushing] = React.useState(false);

  const handlePull = async () => {
    setIsPulling(true);
    try {
      await ApiService.pullContent();
      toast({
        title: 'Content updated',
        description: 'Successfully pulled latest content from repository',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error updating content',
        description: 'Failed to pull latest content. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handlePush = async () => {
    setIsPushing(true);
    try {
      const commitMessage = prompt('Enter a commit message:', 'Update content via UI');
      if (!commitMessage) {
        setIsPushing(false);
        return;
      }
      
      await ApiService.pushContent(commitMessage);
      toast({
        title: 'Content pushed',
        description: 'Successfully pushed content changes to repository',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error pushing content',
        description: 'Failed to push content. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <Box bg="white" px={6} py={4} borderBottom="1px" borderColor="gray.200" shadow="sm">
      <Flex align="center">
        <Heading size="md" color="brand.700">ChefKnight Encyclopedia</Heading>
        <Spacer />
        
        {loading ? (
          <HStack spacing={4}>
            <Skeleton height="40px" width="120px" />
            <Skeleton height="40px" width="100px" />
          </HStack>
        ) : (
          <HStack spacing={4}>
            <HStack spacing={2}>
              <Tooltip label="Current branch and commit">
                <Badge colorScheme="blue" display="flex" alignItems="center">
                  <FaGithub style={{ marginRight: '4px' }} />
                  <Text>{gitStatus?.branch}@{gitStatus?.commit?.substring(0, 7)}</Text>
                </Badge>
              </Tooltip>
              
              {gitStatus?.dirty && (
                <Tooltip label="You have unsaved changes">
                  <Badge colorScheme="orange">Modified</Badge>
                </Tooltip>
              )}
            </HStack>

            <Button
              leftIcon={<FaSync />}
              size="sm"
              onClick={handlePull}
              isLoading={isPulling}
              loadingText="Pulling..."
              colorScheme="blue"
              variant="outline"
            >
              Pull
            </Button>
            
            <Button
              leftIcon={<FaCloudUploadAlt />}
              size="sm"
              onClick={handlePush}
              isLoading={isPushing}
              loadingText="Pushing..."
              colorScheme="green"
              variant="solid"
            >
              Push
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
