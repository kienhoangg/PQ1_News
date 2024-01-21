using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Common.Enums;
using Contracts.Domains;

namespace Models.Entities
{
    public class Question : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? AskedPersonName { get; set; }
        public string? Department { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsNoticed { get; set; }
        public string? QuestionContent { get; set; }
        public string? AnswerContent { get; set; }
        public QuestionStatus QuestionStatus { get; set; }
        public string? AnswerPersonName { get; set; }
        public DateTime? AnswerDate { get; set; }
        public string? FilePath { get; set; }
        public DateTime? QuestionDate { get; set; }
        [DefaultValue(0)]
        public int Views { get; set; }
        public int? QuestionCategoryId { get; set; }
        public QuestionCategory? QuestionCategory { get; set; }
    }
}

