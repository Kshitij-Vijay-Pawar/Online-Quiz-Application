#!/usr/bin/env tsx

import { dbManager } from '../src/lib/db-manager';

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: number;
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'add':
        await addQuestion();
        break;
      case 'list':
        listQuestions();
        break;
      case 'update':
        await updateQuestion();
        break;
      case 'delete':
        await deleteQuestion();
        break;
      case 'count':
        showCount();
        break;
      case 'clear':
        clearQuestions();
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Database Management Commands:

  npm run db:add          - Add a new question interactively
  npm run db:list         - List all questions
  npm run db:update <id>  - Update a question by ID
  npm run db:delete <id>  - Delete a question by ID
  npm run db:count        - Show total question count
  npm run db:clear        - Clear all questions
  npm run db:help         - Show this help message

Examples:
  npm run db:add
  npm run db:list
  npm run db:update 1
  npm run db:delete 5
  npm run db:count
  npm run db:clear
`);
}

async function addQuestion() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = await new Promise<string>((resolve) => {
    readline.question('Enter the question: ', resolve);
  });

  const options: string[] = [];
  for (let i = 0; i < 4; i++) {
    const option = await new Promise<string>((resolve) => {
      readline.question(`Enter option ${String.fromCharCode(65 + i)}: `, resolve);
    });
    options.push(option);
  }

  const correctAnswer = await new Promise<number>((resolve) => {
    readline.question('Enter correct answer (0-3): ', (answer: string) => {
      resolve(parseInt(answer));
    });
  });

  readline.close();

  const questionData: QuestionData = {
    text: question,
    options,
    correctAnswer
  };

  const id = dbManager.addQuestion(questionData);
  console.log(`✅ Question added successfully with ID: ${id}`);
}

function listQuestions() {
  const questions = dbManager.getAllQuestions();
  
  if (questions.length === 0) {
    console.log('No questions found in the database.');
    return;
  }

  console.log(`\n📋 Found ${questions.length} questions:\n`);
  
  questions.forEach((q, index) => {
    console.log(`${index + 1}. ID: ${q.id}`);
    console.log(`   Question: ${q.text}`);
    q.options.forEach((option, i) => {
      const marker = i === q.correctAnswer ? '✓' : ' ';
      console.log(`   ${String.fromCharCode(65 + i)}: ${option} ${marker}`);
    });
    console.log('');
  });
}

async function updateQuestion() {
  const id = parseInt(args[1]);
  if (!id) {
    console.error('❌ Please provide a question ID to update');
    console.log('Usage: npm run db:update <id>');
    return;
  }

  const existingQuestion = dbManager.getQuestion(id);
  if (!existingQuestion) {
    console.error(`❌ Question with ID ${id} not found`);
    return;
  }

  console.log(`\n📝 Updating question ID ${id}:`);
  console.log(`Current: ${existingQuestion.text}\n`);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = await new Promise<string>((resolve) => {
    readline.question('Enter new question (or press Enter to keep current): ', (answer) => {
      resolve(answer || existingQuestion.text);
    });
  });

  const options: string[] = [];
  for (let i = 0; i < 4; i++) {
    const option = await new Promise<string>((resolve) => {
      readline.question(`Enter option ${String.fromCharCode(65 + i)} (or press Enter to keep current): `, (answer) => {
        resolve(answer || existingQuestion.options[i]);
      });
    });
    options.push(option);
  }

  const correctAnswer = await new Promise<number>((resolve) => {
    readline.question(`Enter correct answer (0-3, current: ${existingQuestion.correctAnswer}): `, (answer) => {
      resolve(answer ? parseInt(answer) : existingQuestion.correctAnswer);
    });
  });

  readline.close();

  const questionData: QuestionData = {
    text: question,
    options,
    correctAnswer
  };

  const success = dbManager.updateQuestion(id, questionData);
  if (success) {
    console.log(`✅ Question ${id} updated successfully`);
  } else {
    console.log(`❌ Failed to update question ${id}`);
  }
}

async function deleteQuestion() {
  const id = parseInt(args[1]);
  if (!id) {
    console.error('❌ Please provide a question ID to delete');
    console.log('Usage: npm run db:delete <id>');
    return;
  }

  const question = dbManager.getQuestion(id);
  if (!question) {
    console.error(`❌ Question with ID ${id} not found`);
    return;
  }

  console.log(`\n🗑️  Deleting question ID ${id}:`);
  console.log(`Question: ${question.text}`);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const confirm = await new Promise<string>((resolve) => {
    readline.question('Are you sure? (y/N): ', resolve);
  });

  readline.close();

  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    const success = dbManager.deleteQuestion(id);
    if (success) {
      console.log(`✅ Question ${id} deleted successfully`);
    } else {
      console.log(`❌ Failed to delete question ${id}`);
    }
  } else {
    console.log('❌ Deletion cancelled');
  }
}

function showCount() {
  const count = dbManager.getQuestionCount();
  console.log(`📊 Total questions in database: ${count}`);
}

function clearQuestions() {
  const count = dbManager.getQuestionCount();
  console.log(`⚠️  This will delete all ${count} questions from the database.`);
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Are you sure? Type "DELETE ALL" to confirm: ', (answer) => {
    readline.close();
    
    if (answer === 'DELETE ALL') {
      dbManager.clearAllQuestions();
      dbManager.resetAutoIncrement();
      console.log('✅ All questions cleared successfully');
    } else {
      console.log('❌ Clear operation cancelled');
    }
  });
}

// Run the script
main();

