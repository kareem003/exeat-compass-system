
#!/bin/bash

# Deployment script for manual deployments
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Build the application
echo "📦 Building application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test --passWithNoTests

# Deploy based on environment
case $ENVIRONMENT in
  "production")
    echo "🌍 Deploying to production..."
    # Add production deployment commands here
    ;;
  "staging")
    echo "🎭 Deploying to staging..."
    # Add staging deployment commands here
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "✅ Deployment completed successfully!"
