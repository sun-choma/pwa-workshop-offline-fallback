import { Code, HStack, List, Text, VStack } from "@chakra-ui/react";
import {
  DatabaseIcon,
  EraserIcon,
  FileCode2Icon,
  TablePropertiesIcon,
} from "lucide-react";

import { Alert } from "@/components/ui/alert.tsx";
import { useCache } from "@/hooks/useCache.ts";
import { Button } from "@/components/ui/button.tsx";
import pwaLogo from "/pwa-logo.svg";

function App() {
  const {
    addHtmlCache,
    addCssCache,
    addAllResourcesCache,
    clearCache,
    isLoading,
  } = useCache();

  return (
    <VStack gap="4">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
        target="_blank"
      >
        <img src={pwaLogo} className="logo" alt="PWA logo" />
      </a>
      <Text fontSize="5xl" as="h1">
        PWA Workshop
      </Text>
      <Text fontSize="3xl" as="h2">
        Offline fallback
      </Text>
      <VStack gap="4">
        <Text>
          This demo showcases common fallback handling pattern as well as
          on-demand caching. How does this mechanism work:
        </Text>
        <List.Root gap="4">
          <List.Item>
            By default this page resources are not cached. If you'll try to
            reload the page with no network available it won't open (as expected
            from a regular webapp)
          </List.Item>
          <List.Item>
            Try the same thing after clicking on "Cache HTML" button. Even if
            network is unavailable you are still able to open the page.
          </List.Item>
          <List.Item>
            Try caching additional resources and check how pages is rendered
            differently depending on resources available
          </List.Item>
          <List.Item>
            For example, you'll notice a significant layout shift if haven't
            cached CSS files. It won't make much difference in development mode
            due to CSS being bundled in JS
          </List.Item>
          <List.Item>
            If you haven't clicked "Cache All Resources" text will be of default
            font and PWA logo won't be displayed as well
          </List.Item>
        </List.Root>
        <HStack justifyContent="center">
          <Button
            colorPalette="teal"
            onClick={addHtmlCache}
            loading={isLoading}
          >
            <FileCode2Icon />
            Cache HTML and JS
          </Button>
          <Button colorPalette="cyan" onClick={addCssCache} loading={isLoading}>
            <TablePropertiesIcon />
            Cache CSS
          </Button>
          <Button
            colorPalette="purple"
            onClick={addAllResourcesCache}
            loading={isLoading}
          >
            <DatabaseIcon />
            Cache All Resources
          </Button>
          <Button
            colorPalette="red"
            variant="subtle"
            onClick={clearCache}
            loading={isLoading}
          >
            <EraserIcon />
            Clear Cache
          </Button>
        </HStack>
      </VStack>
      <Alert
        title={<b>It's all about Progressive Enhancement</b>}
        status="warning"
      >
        It may be tempting to use Service Worker even when it's not needed. For
        example, for providing fallback when dynamic module
        <Code>react.lazy</Code> failed to load. Since error can already be
        handled client side it's better to include this logic in the basic app
        thus improving UX for every user. <br />
        (Yup, there are browser versions still being used that don't support
        Service Workers).
        <br /> Remember: PWA is all about <b>extra features</b>.
      </Alert>
    </VStack>
  );
}

export default App;
