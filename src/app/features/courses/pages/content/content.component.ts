import { Component, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { NgIconComponent } from '@ng-icons/core';
import { CustomDeleteButtonComponent } from '../../../../shared/components/custom-delete-button/custom-delete-button.component';
import { CommonModule } from '@angular/common';
import { CustomEditButtonComponent } from '../../../../shared/components/custom-edit-button/custom-edit-button.component';

@Component({
  selector: 'app-content',
  imports: [
    CustomButtonComponent,
    NgIconComponent,
    CustomDeleteButtonComponent,
    CommonModule,
    CustomEditButtonComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent implements OnInit {
  openedChapterIds: number[] = [];
  lessonActiveId: number | null = null;
  chapter: { id: number; title: string }[] = [
    {
      id: 1,
      title: 'Overview',
    },
    {
      id: 2,
      title: 'Component and Props',
    },
  ];

  lesson: { id: number; chapterId: number; title: string }[] = [
    {
      id: 1,
      chapterId: 1,
      title: 'What is React?',
    },
    {
      id: 2,
      chapterId: 1,
      title: 'Environment setting',
    },
    {
      id: 3,
      chapterId: 2,
      title: 'Functional Components',
    },
    {
      id: 4,
      chapterId: 2,
      title: 'Quizz chapter 2',
    },
  ];

  chaptersWithLessons: {
    id: number;
    title: string;
    lessons: { id: number; chapterId: number; title: string }[];
  }[] = [];

  ngOnInit(): void {
    this.chaptersWithLessons = this.chapter.map((ch) => ({
      ...ch,
      lessons: this.lesson.filter((ls) => ls.chapterId === ch.id),
    }));
  }

  toggleChapter(chapterId: number) {
    const index = this.openedChapterIds.indexOf(chapterId);
    if (index > -1) {
      this.openedChapterIds.splice(index, 1);
    } else {
      this.openedChapterIds.push(chapterId);
    }
  }

  isChapterOpen(chapterId: number): boolean {
    return this.openedChapterIds.includes(chapterId);
  }

  OnLessonActive(lessonId: number) {
    this.lessonActiveId = lessonId;
  }
}
